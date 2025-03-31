import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseBoolPipe,
  Body,
  NotFoundException,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { Song } from './entities/songs.enitity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateSongDto } from './dto/update-song.dto';
import { SongNotFoundError } from './errors/song-not-found.error';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('songs')
export class SongsController {
  constructor(private songsService: SongsService) {}

  @Post()
  create(@Body() createSongDto: CreateSongDto): Promise<Song> {
    const results = this.songsService.create(createSongDto);
    return results;
  }
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
  ): Promise<Pagination<Song>> {
    limit = limit > 100 ? 100 : limit;
    return this.songsService.paginate({page,limit});
  }
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Song> {
    // <-- I've made this one async to be able to catch the error from the promise since try/catch works on synchronous code or awaited async
    try {
      return await this.songsService.findOne(id);
    } catch (error) {
      if (error instanceof SongNotFoundError) {
        throw new NotFoundException(`Song with ID ${id} not found`);
      }
      throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.songsService.remove(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() recordToUpdate: UpdateSongDto,
  ): Promise<UpdateResult> {
    return this.songsService.update(id, recordToUpdate);
  }
}
