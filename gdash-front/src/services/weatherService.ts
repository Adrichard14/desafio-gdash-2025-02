import { WeatherResponse } from '@/types/weather';
import { apiClient } from '../lib/axios';
import { InsightResponse } from '@/types/insight';

export class WeatherService {
    constructor() { }

    private static readonly BASE_PATH = '/weather';

    static async getLastWeather(): Promise<WeatherResponse> {
        try {
            const response = await apiClient.get<WeatherResponse>(
                `${this.BASE_PATH}`,
            );
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar dados do tempo:', error);
            throw error;
        }
    }


    static async getInsight(): Promise<InsightResponse> {
        try {
            const response = await apiClient.get<InsightResponse>(
                `${this.BASE_PATH}/insights`,
            );
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar insights:', error);
            throw error;
        }
    }
}