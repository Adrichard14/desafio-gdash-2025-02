import { useState, useEffect } from 'react';
import { WeatherService } from '../services/weatherService';
import { InsightResponse } from '@/types/insight';

interface UseInsightReturn {
    insights: string;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export const useInsights = (): UseInsightReturn => {
    const [insights, setInsights] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchInsight = async () => {
        try {
            setLoading(true);
            setError(null);

            const insightData: InsightResponse = await WeatherService.getInsight();
            if (insightData && insightData.insight) {
                setInsights(insightData.insight);
            }
        } catch (err) {
            setError(err as Error);
            console.error('Erro ao buscar dados do tempo:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsight();
    }, []);

    return { insights, loading, error, refetch: fetchInsight };
};