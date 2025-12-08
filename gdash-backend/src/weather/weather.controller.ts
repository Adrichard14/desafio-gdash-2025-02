import { Body, Controller, Get, Injectable, Param, ParseIntPipe, Post, Query, Res, StreamableFile } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { promises as fs } from 'fs';
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
    async getWeatherLogs(@Query('page', ParseIntPipe) page: number = 1, @Query('limit', ParseIntPipe) limit: 25) {
        return await this.weatherService.getAllLogs({ page, limit });
    }

    @Post('export')
    async exportWeatherLogs(@Body() body: { type: string }): Promise<StreamableFile> {
        const { type } = body;
        let filePath: string;
        let mimeType: string;
        let fileName: string;

        const timestamp = new Date().toISOString().split('T')[0];

        if (type === 'csv') {
            filePath = await this.weatherService.exportToCSV();
            mimeType = 'text/csv; charset=utf-8';
            fileName = `historico-clima-${timestamp}.csv`;
        } else {
            filePath = await this.weatherService.exportToXLSX();
            mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            fileName = `historico-clima-${timestamp}.xlsx`;
        }

        const fileBuffer = await fs.readFile(filePath);

        const streamableFile = new StreamableFile(fileBuffer, {
            type: mimeType,
            disposition: `attachment; filename="${fileName}"`,
        });

        setTimeout(async () => {
            try {
                await fs.unlink(filePath);
            } catch (err) {
                console.error('Erro ao remover arquivo temporário:', err);
            }
        }, 1000);

        return streamableFile;
    }
}
