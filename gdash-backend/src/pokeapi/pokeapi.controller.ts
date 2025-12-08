import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { PokeapiService } from './pokeapi.service';

@Controller('pokeapi')
export class PokeapiController {
    constructor(private readonly pokeApiService: PokeapiService) { }

    @Get('pokemons')
    async getPokemons(@Query('limit', ParseIntPipe) limit: number = 20, @Query('limit', ParseIntPipe) offset: number = 0) {
        return await this.pokeApiService.getPokemons({ limit, offset });
    }
}
