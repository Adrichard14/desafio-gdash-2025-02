import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
    Sun,
    CloudRain,
    Wind,
    Droplets,
    Eye,
    Activity,
    Map,
    Settings,
    Bell,
    User,
    AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useWeather } from '../hooks/useWeather';
import { weatherCodeMap } from '../lib/utils';
import { useInsights } from '../hooks/useInsights';
import AIInsightsCard from '../components/insight-card/card';

const WeatherDashboard = () => {
    const { data, loading, error, refetch } = useWeather();
    const { insights, loading: insightsLoading, error: insightsError, refetch: insightsRefresh } = useInsights();
    const current_weather = data?.body.weatherData?.current_weather;
    const current_weather_units = data?.body.weatherData?.current_weather_units;
    const location = data?.body.weatherData?.location;

    const hourlyData = data?.body.weatherData.hourly;

    const temperatureData = hourlyData?.time?.slice(0, 24).map((data, index) => ({ time: data?.split('T')[1], temp: hourlyData?.temperature_2m[index] })) || [];

    const { minTemp, maxTemp } = useMemo(() => {
        const combined = hourlyData?.time.map((t, i) => ({
            time: t.split('T')[1],
            temperature_2m: hourlyData.temperature_2m[i]
        })) || [];

        combined.sort((a, b) => a.temperature_2m - b.temperature_2m);

        return {
            minTemp: combined[0] || { time: '', temperature_2m: 0 },
            maxTemp: combined[combined.length - 1] || { time: '', temperature_2m: 0 }
        };
    }, [hourlyData]);

    const dailyData = useMemo(() => {
        if (!hourlyData) return undefined;

        const times = hourlyData.time;
        const uvValues = hourlyData.uv_index;
        const rainValues = hourlyData.precipitation_probability;
        const humidity = hourlyData.relative_humidity_2m;

        const now = new Date();
        const nowLocalISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 13);


        const idx = times.findIndex(t => t.startsWith(nowLocalISO));

        let currentUv = 0;
        let currentRain = 0;
        let currentHumidity = 0;

        if (idx !== -1) {
            currentUv = uvValues?.[idx] ?? 0;
            currentRain = rainValues?.[idx] ?? 0;
            currentHumidity = humidity?.[idx] ?? 0;
        }

        return {
            ...current_weather,
            uv: currentUv,
            rainProbability: currentRain,
            humidity: currentHumidity,
        };
    }, [current_weather, hourlyData]);
    if (loading) {
        return <div>Carregando dados do tempo...</div>;
    }


    if (error) {
        return (
            <div>
                <p>Erro ao carregar dados: {error.message}</p>
                <button onClick={refetch}>Tentar novamente</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 p-6">
            <div className="w-full h-full">
                <div className="mb-8">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                                <Map className="w-4 h-4" />
                                <span className="text-sm">{location ? `${location.city}, ${location.state}, ${location.country}` : ''}</span>
                            </div>
                            <h1 className="text-6xl font-bold text-gray-800 mb-2">{current_weather?.temperature}{current_weather_units?.temperature}</h1>
                            <p className="text-gray-600">{current_weather?.weathercode ? weatherCodeMap[current_weather?.weathercode] : "Desconhecido"}</p>
                            <p className="text-sm text-gray-500 mt-1">Sensação térmica: 31°C</p>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-8 rounded-3xl shadow-lg">
                            <Sun className="w-24 h-24 text-white" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-6">
                    <div className="flex flex-col gap-4">
                        <Card className="w-16 p-3 bg-white/80 backdrop-blur">
                            <div className="flex flex-col gap-4 items-center">
                                <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-white" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center justify-center">
                                    <Map className="w-6 h-6 text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center justify-center">
                                    <Bell className="w-6 h-6 text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center justify-center">
                                    <Settings className="w-6 h-6 text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition mt-auto flex items-center justify-center">
                                    <User className="w-6 h-6 text-gray-600" />
                                </button>
                            </div>
                        </Card>
                    </div>
                    <div className="flex-1 flex flex-col gap-6">
                        <AIInsightsCard insights={insights} loading={insightsLoading} error={insightsError} onRefresh={insightsRefresh} />

                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Temperatura Mínima</p>
                                    <p className="text-2xl font-bold text-blue-600">{minTemp.temperature_2m}°C</p>
                                    <p className="text-xs text-gray-500 mt-1">Às {minTemp.time}</p>
                                </div>
                                <div className="bg-indigo-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Temperatura Máxima</p>
                                    <p className="text-2xl font-bold text-indigo-600">{maxTemp.temperature_2m}°C</p>
                                    <p className="text-xs text-gray-500 mt-1">Às {maxTemp.time}</p>
                                </div>
                            </div>
                        </CardContent>

                        <Card className="bg-white/80 backdrop-blur shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl">Temperatura ao Longo do Dia</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={temperatureData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis
                                            dataKey="time"
                                            stroke="#666"
                                            style={{ fontSize: '12px' }}
                                        />
                                        <YAxis
                                            stroke="#666"
                                            style={{ fontSize: '12px' }}
                                            unit="°C"
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #ddd',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="temp"
                                            stroke="#3b82f6"
                                            strokeWidth={3}
                                            dot={{ fill: '#3b82f6', r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>

                                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>Temperatura média histórica para novembro: 26°C</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="w-64">
                        <Card className="bg-white/80 backdrop-blur shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg">Condições Atuais</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Qualidade do Ar</span>
                                        <Eye className="w-4 h-4 text-green-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-green-600">Boa</p>
                                    <p className="text-xs text-gray-500 mt-1">AQI: 42</p>
                                </div>

                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Vento</span>
                                        <Wind className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-blue-600">{current_weather?.windspeed}{current_weather_units?.windspeed}</p>
                                    <p className="text-xs text-gray-500 mt-1">Direção: Nordeste</p>
                                </div>

                                <div className="p-3 bg-indigo-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Chuva</span>
                                        <Droplets className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-indigo-600">{dailyData?.rainProbability}%</p>
                                </div>

                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Índice UV</span>
                                        <Sun className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-orange-600">{dailyData?.uv}</p>
                                </div>

                                <div className="p-3 bg-purple-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Umidade</span>
                                        <CloudRain className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-purple-600">{dailyData?.humidity}%</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default WeatherDashboard;