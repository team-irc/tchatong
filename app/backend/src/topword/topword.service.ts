import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topword } from 'src/entities/topword.entity';
import { StreamerService } from 'src/streamer/streamer.service';
import { Repository } from 'typeorm';

@Injectable()
export class TopwordService {
  constructor(
    @InjectRepository(Topword)
    private topwordRepository: Repository<Topword>,
    @Inject(forwardRef(() => StreamerService))
    private streamerService: StreamerService,
  ) {}

  async findTopword(nick: string): Promise<Topword> {
    const streamer = await this.streamerService.findOneByNick(nick);
    const sql = `select * from topword where (streamer_login = '${streamer.streamer_login}') ORDER BY id DESC LIMIT 1;`;
    const topword = await this.topwordRepository.query(sql);
    if (topword.length == 0) {
      return new Topword();
    }
    return topword[0];
  }
}
