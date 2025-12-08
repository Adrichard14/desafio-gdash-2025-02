import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather } from './weather.model';
import { GoogleGenAI } from '@google/genai';
import { join } from 'path';
import { promises as fs } from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
import * as ExcelJS from 'exceljs';
import { weatherCodeMap } from 'src/constants/weatherMap';

@Injectable()
export class WeatherService {
    constructor(@InjectModel('Weather') private readonly weatherModel: Model<Weather>) { }
    async add(body) {
        const newWeatherData = new this.weatherModel({ body });
        const result = await newWeatherData.save();
        return result;
    }

    async getLastWeather(): Promise<Weather | null> {
        const lastWeatherData = await this.weatherModel.findOne().sort({ createdAt: -1 });
        return lastWeatherData;
    }

    async getAllLogs({ page, limit }: { page: number; limit: number; }) {
        const skip = (page - 1) * limit;
        const data = await this.weatherModel.find().skip(skip).limit(limit).sort({ createdAt: 'desc' });
        const totalCount = await this.weatherModel.countDocuments();
        return {
            data,
            total: totalCount,
            limit: limit,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        }
    }

    async insights() {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

        const lastWeather = await this.getLastWeather();
        const body = lastWeather?.body;
        const weatherData = body?.weatherData;
        const { hourly_units, hourly, ...sanitezedData } = weatherData ?? {};
        if (sanitezedData) {

            const prompt = `Você é um assistente especializado em clima e estilo de vida. 
        Com base nos seguintes dados meteorológicos retornados pela API Open-Meteo:

        ${JSON.stringify(sanitezedData)}

        Gere recomendações, dicas práticas ou alertas relevantes para uma pessoa que está nessa região. 
        Considere um limite de 700 caracteres: a resposta deve ser objetiva e não muito longa. 
        Utilize emojis para deixar as respostas mais descontraídas.

        Responda SOMENTE com o texto puro, sem blocos de código, sem formatação markdown e sem explicações adicionais.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            return {
                insight: response.text,
            };

        }
        return null;
    }

    async exportToCSV(): Promise<string> {
        const { data }: { data: any[] } = await this.getAllLogs({ page: 1, limit: 999999 });

        const fileName = `historico-clima-${Date.now()}.csv`;
        const filePath = join(process.cwd(), 'temp', fileName);

        await fs.mkdir(join(process.cwd(), 'temp'), { recursive: true });

        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'date', title: 'Data e Hora' },
                { id: 'condition', title: 'Condição' },
                { id: 'temperature', title: 'Temperatura' },
                { id: 'humidity', title: 'Umidade (%)' },
                { id: 'windSpeed', title: 'Vento' },
                { id: 'rainChance', title: 'Chuva (%)' },
                { id: 'uvIndex', title: 'Índice UV' },
            ],
        });

        const formattedData = data.map(item => {
            const hourlyData = item?.body?.weatherData?.hourly;
            const times = hourlyData?.time;
            const uvValues = hourlyData?.uv_index;
            const rainValues = hourlyData?.precipitation_probability;
            const humidityValues = hourlyData?.relative_humidity_2m;

            const createdAtDate = new Date(item.createdAt);
            const createdAtIso = new Date(
                createdAtDate.getTime() - createdAtDate.getTimezoneOffset() * 60000
            ).toISOString().slice(0, 13);

            const idx = times?.findIndex(t => t.startsWith(createdAtIso)) ?? -1;

            let currentUv = 0;
            let currentRain = 0;
            let currentHumidity = 0;

            if (idx !== -1) {
                currentUv = uvValues?.[idx] ?? 0;
                currentRain = rainValues?.[idx] ?? 0;
                currentHumidity = humidityValues?.[idx] ?? 0;
            }

            return {
                date: new Date(item.createdAt).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                }),
                condition: item?.body?.weatherData?.current_weather?.weathercode
                    ? weatherCodeMap[item?.body?.weatherData?.current_weather?.weathercode]
                    : 'Desconhecido',
                temperature: `${item?.body?.weatherData?.current_weather?.temperature} ${item?.body?.weatherData?.current_weather_units?.temperature}`,
                humidity: currentHumidity,
                windSpeed: `${item?.body?.weatherData?.current_weather?.windspeed} ${item?.body?.weatherData?.current_weather_units?.windspeed}`,
                rainChance: `${currentRain}%`,
                uvIndex: currentUv,
            };
        });

        await csvWriter.writeRecords(formattedData);
        return filePath;
    }

    ;

    async exportToXLSX(): Promise<string> {
        const { data }: { data: any[] } = await this.getAllLogs({ page: 1, limit: 999999 });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Histórico do Clima');

        worksheet.columns = [
            { header: 'Data e Hora', key: 'date', width: 20 },
            { header: 'Condição', key: 'condition', width: 25 },
            { header: 'Temperatura', key: 'temperature', width: 15 },
            { header: 'Umidade (%)', key: 'humidity', width: 15 },
            { header: 'Velocidade do Vento', key: 'windSpeed', width: 20 },
            { header: 'Chance de Chuva (%)', key: 'rainChance', width: 20 },
            { header: 'Índice UV', key: 'uvIndex', width: 12 },
        ];

        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
        headerRow.height = 25;

        data.forEach(item => {
            const hourlyData = item?.body?.weatherData?.hourly;
            const times = hourlyData?.time;
            const uvValues = hourlyData?.uv_index;
            const rainValues = hourlyData?.precipitation_probability;
            const humidityValues = hourlyData?.relative_humidity_2m;

            const createdAtDate = new Date(item.createdAt);
            const createdAtIso = new Date(
                createdAtDate.getTime() - createdAtDate.getTimezoneOffset() * 60000
            ).toISOString().slice(0, 13);

            const idx = times?.findIndex(t => t.startsWith(createdAtIso)) ?? -1;

            let currentUv = 0;
            let currentRain = 0;
            let currentHumidity = 0;

            if (idx !== -1) {
                currentUv = uvValues?.[idx] ?? 0;
                currentRain = rainValues?.[idx] ?? 0;
                currentHumidity = humidityValues?.[idx] ?? 0;
            }

            const row = worksheet.addRow({
                date: new Date(item.createdAt).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                }),
                condition: item?.body?.weatherData?.current_weather?.weathercode
                    ? weatherCodeMap[item?.body?.weatherData?.current_weather?.weathercode]
                    : 'Desconhecido',
                temperature: `${item?.body?.weatherData?.current_weather?.temperature} ${item?.body?.weatherData?.current_weather_units?.temperature}`,
                humidity: currentHumidity,
                windSpeed: `${item?.body?.weatherData?.current_weather?.windspeed} ${item?.body?.weatherData?.current_weather_units?.windspeed}`,
                rainChance: `${currentRain}%`,
                uvIndex: currentUv,
            });

            row.alignment = { vertical: 'middle' };
            row.getCell('humidity').alignment = { horizontal: 'center' };
            row.getCell('rainChance').alignment = { horizontal: 'center' };
            row.getCell('uvIndex').alignment = { horizontal: 'center' };

            // Estilização baseada no valor de UV
            const uvCell = row.getCell('uvIndex');
            if (currentUv >= 8) {
                uvCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFECACA' } };
                uvCell.font = { color: { argb: 'FF991B1B' }, bold: true };
            } else if (currentUv >= 6) {
                uvCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
                uvCell.font = { color: { argb: 'FF92400E' }, bold: true };
            } else {
                uvCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } };
                uvCell.font = { color: { argb: 'FF065F46' }, bold: true };
            }
        });

        worksheet.eachRow(row => {
            row.eachCell(cell => {
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
                    left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
                    bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
                    right: { style: 'thin', color: { argb: 'FFD1D5DB' } },
                };
            });
        });

        worksheet.autoFilter = { from: 'A1', to: 'G1' };

        const fileName = `historico-clima-${Date.now()}.xlsx`;
        const filePath = join(process.cwd(), 'temp', fileName);

        await fs.mkdir(join(process.cwd(), 'temp'), { recursive: true });
        await workbook.xlsx.writeFile(filePath);

        return filePath;
    }
}
