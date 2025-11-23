import { WeatherResponse } from '@/types/weather';
import { useState, useEffect } from 'react';
import { WeatherService } from '../services/weatherService';

interface UseWeatherReturn {
    data: WeatherResponse | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export const useWeather = (): UseWeatherReturn => {
    const [data, setData] = useState<WeatherResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchWeather = async () => {
        try {
            setLoading(true);
            setError(null);

            const weatherData: WeatherResponse = await WeatherService.getLastWeather();
            if (weatherData && weatherData.body) {
                setData(weatherData);
            }
        } catch (err) {
            setError(err as Error);
            console.error('Erro ao buscar dados do tempo:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, []);

    return { data, loading, error, refetch: fetchWeather };
};