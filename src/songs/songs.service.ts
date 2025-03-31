import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './entities/songs.enitity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { SongNotFoundError } from './errors/song-not-found.error';
import {
  IPaginationOptions,
  paginate as paginateHelper,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song) private songRepository: Repository<Song>,
  ) {}
  async create(songDTO: CreateSongDto): Promise<Song> {
    const song = new Song();
    song.title = songDTO.title;
    song.artists = songDTO.artists;
    song.duration = songDTO.duration;
    song.lyrics = songDTO.lyrics;
    song.releasedDate = songDTO.releasedDate;

    return await this.songRepository.save(song);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    // add query builder here
    // this is an example i found on an e-book of a query builder that would order this songs based on their relase dates
    // const queryBuilder = this.songRepository.createQueryBuilder('c');
    // queryBuilder.orderBy('c.releasedDate', 'DESC');
    // return paginateHelper<Song>(queryBuilder, options);
    
    return paginateHelper<Song>(this.songRepository, options);
  }

  async findAll(): Promise<Song[]> {
    return await this.songRepository.find();
  }

  async findOne(id: number): Promise<Song> {
    const song = await this.songRepository.findOneBy({ id: id });
    if (!song) {
      throw new SongNotFoundError();
    }
    return song;
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.songRepository.delete(id);
  }

  async update(
    id: number,
    recordToUpdate: UpdateSongDto,
  ): Promise<UpdateResult> {
    return await this.songRepository.update(id, recordToUpdate);
  }
}
