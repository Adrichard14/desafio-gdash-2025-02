interface CurrentWeatherData {
    time: Date;
    interval: number;
    temperature: number;
    windspeed: number;
    winddirection: number;
    is_day: number;
    weathercode: number;
}

interface CurrentWeatherUnits {
    time: string;
    interval: string;
    temperature: string;
    windspeed: string;
    winddirection: string;
    is_day: string;
    weathercode: string;
}

interface WeatherLocationInfo {
    city: string;
    state: string;
    country: string;
}

interface HourlyData {
    time: string[];
    temperature_2m: number[];
    uv_index: number[];
    precipitation_probability: number[];
    relative_humidity_2m: number[];
}

interface WeatherData {
    current_weather: CurrentWeatherData;
    current_weather_units: CurrentWeatherUnits;
    location?: WeatherLocationInfo;
    hourly?: HourlyData;
}

interface WeatherBody {
    weatherData: WeatherData;
}

export interface WeatherResponse {
    body: WeatherBody;
    createdAt: Date;
    _id?: string;
}
export interface WeatherLogsPagination {
    limit: number;
    page: number;
}

export interface WeatherLogData {
    data: WeatherLogResponse[];
}
export interface WeatherLogResponse {
    data?: WeatherResponse[];
    totalPages: number;
    currentPage: number;
    total: number;
}