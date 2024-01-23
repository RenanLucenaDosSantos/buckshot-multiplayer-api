import { Injectable } from '@nestjs/common';
import { Cat } from 'src/shared/interfaces/cat.interface';

@Injectable()
export class LobbyService {
    private readonly cats: Cat[] = [];

    create(cat: Cat) {
      this.cats.push(cat);
    }
  
    findAll(): Cat[] {
      return this.cats;
    }
}
