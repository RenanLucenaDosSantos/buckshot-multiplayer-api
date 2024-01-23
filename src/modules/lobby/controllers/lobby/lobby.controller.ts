import { Body, Controller, Get, Post } from '@nestjs/common';
import { LobbyService } from '../../services/lobby/lobby.service';
import { CreateCatDto } from 'src/shared/dto/create-cat.dto';
import { Cat } from 'src/shared/interfaces/cat.interface';

@Controller('lobby')
export class LobbyController {
    constructor(private lobbyService: LobbyService) {}

    @Post()
    async create(@Body() createCatDto: CreateCatDto) {
      this.lobbyService.create(createCatDto);
    }
  
    @Get()
    async findAll(): Promise<Cat[]> {
      return this.lobbyService.findAll();
    }
}
