import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather } from './weather.model';
import { GoogleGenAI } from '@google/genai';

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

    async getAllLogs() {
        return await this.weatherModel.find();
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
}
