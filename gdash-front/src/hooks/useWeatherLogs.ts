import { WeatherLogsPagination, WeatherResponse } from '../types/weather';
import { useState, useEffect } from 'react';
import { WeatherService } from '../services/weatherService';

interface UseWeatherLogsReturn {
    data: WeatherResponse[] | null;
    loading: boolean;
    totalPages: number;
    currentPage: number;
    total: number;
    error: Error | null;
    refetch: (pagination: WeatherLogsPagination) => Promise<void>;
}

export const useWeatherLogs = ({
    limit, page
}: WeatherLogsPagination): UseWeatherLogsReturn => {
    const [data, setData] = useState<WeatherResponse[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [error, setError] = useState<Error | null>(null);

    const fetchWeatherLogs = async ({ limit, page }: WeatherLogsPagination) => {
        try {
            setLoading(true);
            setError(null);

            const { data, totalPages, currentPage, total } = await WeatherService.getLogs({ limit, page });
            if (data) {
                setData(data);
                setTotalPages(totalPages);
                setCurrentPage(currentPage);
                setTotal(total);
            }
        } catch (err) {
            setError(err as Error);
            console.error('Erro ao buscar dados do tempo:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeatherLogs({ page, limit });
    }, []);

    return { data, totalPages, currentPage, total, loading, error, refetch: fetchWeatherLogs };
};