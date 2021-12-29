import { forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
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
    private streamerService: StreamerService
	) {}

	async findTopword(nick: string): Promise<Topword> {
		const streamer = await this.streamerService.findOneByNick(nick);
		const sql = `select * from topword where (streamer_id = '${streamer.streamer_id}') ORDER BY id DESC LIMIT 1;`;
		const topword = await this.topwordRepository.query(sql);
		if (topword.length == 0) {
			throw new InternalServerErrorException("해당 스트리머의 topword 기록이 존재하지 않습니다.");
		}
		return topword[0];
	}
}
