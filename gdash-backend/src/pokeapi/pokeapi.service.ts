import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

interface Pokemon {
    id: number;
    name: string;
    sprites: {
        front_default: string;
    };
}
@Injectable()
export class PokeapiService {

    constructor(private readonly httpService: HttpService) { }

    async getPokemon(name: string): Promise<Pokemon> {
        const response: AxiosResponse<Pokemon> = await firstValueFrom(
            this.httpService.get(`/pokemon/${name}`)
        );
        return response.data;
    }

    async getPokemons({ limit = 20, offset = 0 }): Promise<any> {
        const response: AxiosResponse<any> = await firstValueFrom(
            this.httpService.get(`/pokemon`, { params: { limit, offset } })
        );
        return response.data;
    }
}
