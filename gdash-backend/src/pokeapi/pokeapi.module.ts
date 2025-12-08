import { Module } from '@nestjs/common';
import { PokeapiController } from './pokeapi.controller';
import { PokeapiService } from './pokeapi.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://pokeapi.co/api/v2',
      timeout: 5000,
    }),
  ],
  controllers: [PokeapiController],
  providers: [PokeapiService]
})
export class PokeapiModule { }
