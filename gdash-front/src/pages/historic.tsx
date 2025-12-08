import { useWeatherLogs } from "../hooks/useWeatherLogs";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "../components/ui/table";
import { ChevronLeft, ChevronRight, Cloud, CloudRain, Download, Loader, Sun } from "lucide-react";
import { useState } from "react";
import { weatherCodeMap } from "@/lib/utils";
import { WeatherResponse } from "@/types/weather";
import { StatusBadge } from "@/components/ui/badge";
import { Container } from "@/components/container/container";
import { WeatherService } from "@/services/weatherService";

const WeatherHistoryPage = () => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [isExporting, setIsExporting] = useState(false);
    const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx'>('csv');

    const { data, totalPages, loading, total, error, refetch } = useWeatherLogs({ page: 1, limit: itemsPerPage });


    const nextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
        refetch({ page: currentPage + 1, limit: itemsPerPage });
    };

    const prevPage = () => {
        setCurrentPage(prev => Math.min(prev - 1, totalPages));
        refetch({ page: currentPage - 1, limit: itemsPerPage });
    };

    const startIndex = (currentPage - 1) * itemsPerPage;

    const getConditionIcon = (condition: string) => {
        if (condition?.includes('Ensolarado')) return <Sun className="w-5 h-5 text-yellow-500" />;
        if (condition?.includes('limpo')) return <Sun className="w-5 h-5 text-yellow-500" />;
        if (condition?.includes('Chuv')) return <CloudRain className="w-5 h-5 text-blue-500" />;
        if (condition?.includes('Aguaceiros')) return <CloudRain className="w-5 h-5 text-blue-500" />
        if (condition?.includes('Nublado')) return <Cloud className="w-5 h-5 text-gray-500" />;
        return <Cloud className="w-5 h-5 text-gray-400" />;
    };

    const getUVBadgeVariant = (uvIndex: number): 'success' | 'warning' | 'danger' => {
        if (uvIndex >= 8) return 'danger';
        if (uvIndex >= 6) return 'warning';
        return 'success';
    };
    const handleExport = async () => {
        setIsExporting(true);
        try {
            const response = await WeatherService.exportLogs(exportFormat);
            console.log(response);

            if (!response) throw new Error('Erro ao exportar dados');

            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;

            const disposition = response.headers['content-disposition'];
            const fileName =
                disposition?.split('filename=')[1]?.replace(/"/g, '') ||
                `historico-clima-${new Date().toISOString().split('T')[0]}.${exportFormat}`;

            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            alert(`Exportando dados no formato ${exportFormat.toUpperCase()}...`);
        } catch (error) {
            console.error('Erro ao exportar:', error);
            alert('Erro ao exportar dados. Tente novamente.');
        } finally {
            setIsExporting(false);
        }
    };

    const loadTableBody = (data: WeatherResponse[] | null) => {
        if (loading) {
            return <div className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="animate-spin">
                        <Loader className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-gray-600">Carregando...</p>
                </div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                </div>
            </div>;
        }

        if (error) {
            return (
                <div>
                    <p>Erro ao carregar dados: {error.message}</p>
                    <button onClick={() => refetch({ page: currentPage, limit: itemsPerPage })}>Tentar novamente</button>
                </div>
            );
        }
        return (
            <TableBody>
                {data && data?.length > 0 ? (
                    data.map((item) => {
                        const hourlyData = item?.body.weatherData.hourly;
                        const times = hourlyData?.time;
                        const uvValues = hourlyData?.uv_index;
                        const rainValues = hourlyData?.precipitation_probability;
                        const humidity = hourlyData?.relative_humidity_2m;

                        const createdAtDate = new Date(item.createdAt);
                        const createdAtIso = new Date(createdAtDate.getTime() - createdAtDate.getTimezoneOffset() * 60000)
                            .toISOString()
                            .slice(0, 13);

                        const idx = times?.findIndex(t => t.startsWith(createdAtIso)) || 0;
                        let currentUv = 0;
                        let currentRain = 0;
                        let currentHumidity = 0;

                        if (idx !== -1) {
                            currentUv = uvValues?.[idx] ?? 0;
                            currentRain = rainValues?.[idx] ?? 0;
                            currentHumidity = humidity?.[idx] ?? 0;
                        }
                        return (
                            <TableRow key={item._id}>
                                <TableCell className="font-medium">
                                    {new Date(item.createdAt).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric'
                                    })}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {getConditionIcon(weatherCodeMap[item?.body?.weatherData?.current_weather?.weathercode])}
                                        <span className="text-sm">{item?.body?.weatherData?.current_weather?.weathercode ? weatherCodeMap[item?.body?.weatherData?.current_weather?.weathercode] : "Desconhecido"}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="font-semibold text-blue-600">{item?.body?.weatherData?.current_weather?.temperature}
                                        {item?.body?.weatherData?.current_weather_units?.temperature}</span>
                                </TableCell>
                                <TableCell className="text-center text-gray-600">
                                    {currentHumidity}
                                </TableCell>
                                <TableCell className="text-center text-gray-600">
                                    {item?.body?.weatherData?.current_weather?.windspeed} {item?.body?.weatherData?.current_weather_units?.windspeed}
                                </TableCell>
                                <TableCell className="text-center text-gray-600">
                                    {currentRain}%
                                </TableCell>
                                <TableCell className="text-center">
                                    <StatusBadge variant={getUVBadgeVariant(currentUv)}>
                                        UV {currentUv}
                                    </StatusBadge>
                                </TableCell>
                            </TableRow>
                        )
                    })
                ) : (
                    <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                            Nenhum registro encontrado
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        );
    }

    return (
        <Container>
            <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 p-6">
                <div className="w-full mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-800 mb-2">Histórico de Dados</h1>
                                <p className="text-gray-600">Registro detalhado das condições climáticas</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <select
                                    value={exportFormat}
                                    onChange={(e) => setExportFormat(e.target.value as 'csv' | 'xlsx')}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={isExporting}
                                >
                                    <option value="csv">CSV</option>
                                    <option value="xlsx">XLSX (Excel)</option>
                                </select>
                                <button
                                    onClick={handleExport}
                                    disabled={isExporting}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Download className="w-4 h-4" />
                                    {isExporting ? 'Exportando...' : 'Exportar'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <Card className="bg-white/80 backdrop-blur shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl">Registros Climáticos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Condição</TableHead>
                                        <TableHead className="text-center">Temperatura</TableHead>
                                        <TableHead className="text-center">Umidade</TableHead>
                                        <TableHead className="text-center">Vento</TableHead>
                                        <TableHead className="text-center">Chuva</TableHead>
                                        <TableHead className="text-center">UV</TableHead>
                                        {/* <TableHead className="text-center">Qualidade do Ar</TableHead> */}
                                    </TableRow>
                                </TableHeader>
                                {loadTableBody(data)}
                            </Table>

                            {/* Paginação */}
                            {data && data.length > 0 && (
                                <div className="flex items-center justify-between mt-6">
                                    <p className="text-sm text-gray-600">
                                        Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, total)} de {total} registros
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => prevPage()}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm text-gray-700 px-3">
                                            Página {currentPage} de {totalPages}
                                        </span>
                                        <button
                                            onClick={() => nextPage()}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div >
        </Container>
    );
}
export default WeatherHistoryPage;
