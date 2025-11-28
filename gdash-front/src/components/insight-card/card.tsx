import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

interface AIInsightsCardProps {
    insights?: string;
    loading?: boolean;
    error?: Error | null;
    onRefresh?: () => void;
}

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({
    insights,
    loading = false,
    error = null,
    onRefresh
}) => {
    return (
        <Card className="bg-white/80 backdrop-blur shadow-lg">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <CardTitle className="text-xl">Insights Gerados por IA</CardTitle>
                    </div>
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            disabled={loading}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                            title="Gerar novos insights"
                        >
                            <RefreshCw className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {loading && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="animate-spin">
                                <Sparkles className="w-6 h-6 text-purple-600" />
                            </div>
                            <p className="text-gray-600">Gerando insights personalizados...</p>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-red-800">Erro ao gerar insights</p>
                                <p className="text-sm text-red-600 mt-1">{error.message}</p>
                                {onRefresh && (
                                    <button
                                        onClick={onRefresh}
                                        className="text-sm text-red-700 underline hover:text-red-800 mt-2"
                                    >
                                        Tentar novamente
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {!loading && !error && insights && (
                    <div className="space-y-4">
                        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                            <div className="flex items-start gap-3">
                                <div className="bg-purple-600 p-2 rounded-lg flex-shrink-0">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                                        {insights}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && !error && !insights && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                        <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 mb-4">Nenhum insight disponível no momento</p>
                        {onRefresh && (
                            <button
                                onClick={onRefresh}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                            >
                                Gerar Insights
                            </button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default AIInsightsCard;