import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chatfire } from '../entities/chatfire.entity';
import { StreamerService } from 'src/streamer/streamer.service';
import { Legend } from 'src/entities/legend.entity';
import { ChatfireAverage } from 'src/entities/chatfire-average.entity';

@Injectable()
export class ChatfireService {
  constructor(
    @InjectRepository(Chatfire)
    private chatFireRepository: Repository<Chatfire>,
    @InjectRepository(Legend)
    private legendRepository: Repository<Legend>,
    @Inject(forwardRef(() => StreamerService))
    private streamerService: StreamerService,
  ) {}

  async findAll(): Promise<Chatfire[]> {
    return this.chatFireRepository.find();
  }

  async findOneByNick(nick: string): Promise<Chatfire[]> {
    const streamer = await this.streamerService.findOneByNick(nick);
    return this.chatFireRepository.find({ streamer_id: streamer.streamer_id });
  }

  async getDayAverageByNick(nick: string): Promise<ChatfireAverage[]> {
    const calculateAverage = (obj: Object): ChatfireAverage[] => {
      const objKeys = Object.keys(obj);
      const sortedByOneHour = {};
      const result: ChatfireAverage[] = [];
      /*
        sortedByOneHour 객체에 시간별로 값을 분류함
        sortedByOneHour = {
          28:0: [1, 2, 3, 4],   // 28일 0시(UTC)의 채팅 화력이 배열에 들어감
          28:1: [2, 3, 4, 5]    // 28일 1시(UTC)의 채팅 화력이 배열에 들어감
        }
      */
      for (let key of objKeys) {
        const time = new Date(key);
        const sortedKey = `${String(time.getDate())}:${String(
          time.getHours(),
        )}`;
        if (!(sortedKey in sortedByOneHour)) sortedByOneHour[sortedKey] = [];
        sortedByOneHour[sortedKey].push(obj[key]);
      }
      console.log(sortedByOneHour);
      /*
        sortedByOneHour 객체에 있는 배열로 평균을 계산함
        result = [{
          time: 28일 0시,
          count: 5      -> [1, 2, 3, 4]의 평균
        }, {
          time: 28일 1시,
          count: 6.5    -> [2, 3, 4, 5]의 평균
        }]
      */
      const sortedByOneHourKeys = Object.keys(sortedByOneHour);
      for (let key of sortedByOneHourKeys) {
        result.push({
          count: Math.ceil(
            sortedByOneHour[key].reduce((a: number, b: number) => a + b) /
              sortedByOneHour[key].length,
          ),
          time: `${key.split(':')[0]}일 ${key.split(':')[1]}시`,
        });
      }
      console.log(result);
      return result;
    };
    const streamer = await this.streamerService.findOneByNick(nick);
    const recentData: Chatfire[] = await this.chatFireRepository.query(
      `SELECT * FROM chatfire WHERE streamer_id='${streamer.streamer_id}' AND date > now() - INTERVAL 1 DAY;`,
    );
    const currentTime = new Date();
    currentTime.setSeconds(0);
    currentTime.setMilliseconds(0);
    let a_day_ago = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);
    /* 최근 24시간 값을 키로 가지고 있는 obj 생성 및 초기화 */
    const obj = {};
    while (currentTime > a_day_ago) {
      obj[a_day_ago.toISOString()] = 0;
      a_day_ago = new Date(a_day_ago.getTime() + 60 * 1000);
    }
    for (let el of recentData) obj[el.date.toISOString()] = el.count;
    return calculateAverage(obj);
  }

  private async getChatfiresAfterDate(
    streamer_id: string,
    date: Date,
  ): Promise<Chatfire[]> {
    const sql = `SELECT * FROM chatfire WHERE (streamer_id = '${streamer_id}' AND date >= '${date}');`;
    return await this.chatFireRepository.query(sql);
  }

  private async initChatfire(): Promise<Chatfire> {
    const chatfire = new Chatfire();
    chatfire.streamer_id = '';
    chatfire.id = 0;
    chatfire.date = new Date();
    chatfire.count = 0;
    return chatfire;
  }

  private async getHighestCountFromChatfires(
    chatfires: Chatfire[],
  ): Promise<Chatfire> {
    let highest_chatfire = await this.initChatfire();
    for (let chatfire of chatfires) {
      if (chatfire.count > highest_chatfire.count) {
        highest_chatfire = chatfire;
        highest_chatfire.count = chatfire.count;
      }
    }
    return highest_chatfire;
  }

  async findDayTop(streamer_nick: string): Promise<Chatfire> {
    const a_day_ago = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    const streamer = await this.streamerService.findOneByNick(streamer_nick);
    const chatfires = await this.getChatfiresAfterDate(
      streamer.streamer_id,
      a_day_ago,
    );
    const day_top = await this.getHighestCountFromChatfires(chatfires);
    day_top.streamer = streamer;
    return day_top;
  }

  private async getLastEntireTop(streamer_id: string): Promise<Legend> {
    return this.legendRepository.findOne({ streamer_id: streamer_id });
  }

  private async saveEntireTopOfStreamer(entire_top: Chatfire) {
    const legend = this.legendRepository.findOne({
      streamer_id: entire_top.streamer_id,
    });
    if (!legend) {
      this.legendRepository.save({
        streamer_id: entire_top.streamer_id,
        chatfire_id: entire_top.id,
        last_update_date: new Date(),
      });
    } else {
      this.legendRepository.update(
        { streamer_id: entire_top.streamer_id },
        {
          streamer_id: entire_top.streamer_id,
          chatfire_id: entire_top.id,
          last_update_date: new Date(),
        },
      );
    }
  }

  private async findEntireTopChatfireById(
    chatfire_id: number,
  ): Promise<Chatfire> {
    const last_entire_top_chatfire = await this.chatFireRepository.findOne({
      id: chatfire_id,
    });
    if (!last_entire_top_chatfire) {
      throw new InternalServerErrorException(
        '해당 chatfire_id를 chatfire 테이블 내에서 찾을 수 없습니다.',
      );
    }
    return last_entire_top_chatfire;
  }

  /*
   @brief 가장 높았던 분당 채팅 화력수를 구해서 반환한다.
          LastUpdateDate를 기준으로 새로 계산해서 저장한다.
   @todo 오랫동안 조회하지 않았던 스트리머를 조회할때 너무 많은 chatfire를 불러와 계산하는 과정에서 문제가 생길 수 있다. (조치 필요)
  */
  private async getEntireTop(streamer_id: string): Promise<Chatfire> {
    const last_entire_top = await this.getLastEntireTop(streamer_id);
    if (!last_entire_top) {
      // 첫 생성
      const chatfires = await this.chatFireRepository.find({
        streamer_id: streamer_id,
      });
      const entire_top = await this.getHighestCountFromChatfires(chatfires);
      this.saveEntireTopOfStreamer(entire_top);
      return entire_top;
    } else {
      // 업데이트
      const last_entire_top_chatfire = await this.findEntireTopChatfireById(
        last_entire_top.chatfire_id,
      );
      const chatfires = await this.getChatfiresAfterDate(
        streamer_id,
        last_entire_top.last_update_date,
      );
      chatfires.push(last_entire_top_chatfire);
      const entire_top = await this.getHighestCountFromChatfires(chatfires);
      this.saveEntireTopOfStreamer(entire_top);
      return entire_top;
    }
  }

  async findEntireTop(streamer_nick: string): Promise<Chatfire> {
    const streamer = await this.streamerService.findOneByNick(streamer_nick);
    const entire_top = await this.getEntireTop(streamer.streamer_id);
    entire_top.streamer = streamer;
    return entire_top;
  }

  async getCurrent(streamer_nick: string): Promise<Chatfire> {
    const streamer = await this.streamerService.findOneByNick(streamer_nick);
    const date = new Date(new Date().getTime() - 60 * 1000);
    date.setSeconds(0);
    date.setMilliseconds(0);
    let chatfire = await this.chatFireRepository.findOne({
      streamer_id: streamer.streamer_id,
      date: date,
    });
    if (!chatfire) {
      chatfire = await this.initChatfire();
    }
    chatfire.streamer = streamer;
    return chatfire;
  }
}
