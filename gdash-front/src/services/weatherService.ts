import { WeatherLogResponse, WeatherLogsPagination, WeatherResponse } from '@/types/weather';
import { apiClient } from '../lib/axios';
import { InsightResponse } from '../types/insight';

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

    static async getLogs({ limit, page }: WeatherLogsPagination): Promise<WeatherLogResponse> {
        console.log(limit, page);
        let filterStr;
        if ((!page && limit) || (!limit && page)) {
            if (page) {
                filterStr = `?page=${page}`;
            }
            if (limit) {
                filterStr = `?limit=${limit}`
            }
        }
        if (limit && page) {
            filterStr = `?limit=${limit}&page=${page}`;
        }
        const requestURL = `${this.BASE_PATH}/logs${filterStr}`;
        const response = await apiClient.get<WeatherLogResponse>(
            requestURL,
        );
        return response.data;
    }

    static async exportLogs(type: string): Promise<any> {
        const response = await apiClient.post<any>(
            `${this.BASE_PATH}/export`,
            { type },
            { responseType: 'blob' }
        );
        return response;
    }
}