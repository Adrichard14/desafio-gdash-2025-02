import { Body, Controller, Get, Injectable, Post } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) { }

    @Post('')
    async addWeather(@Body() body: any) {
        return await this.weatherService.add(body);
    }

    @Get('/insights')
    async insights() {
        return await this.weatherService.insights();
    }

    @Get()
    async getLastWeatherData() {
        return await this.weatherService.getLastWeather();
    }

    @Get('logs')
    async getWeatherLogs() {
        return await this.weatherService.getAllLogs();
    }
}
