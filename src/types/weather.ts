export type OpenMeteoResponse = {
  current?: {
    time: string;
    temperature_2m?: number;
    precipitation?: number;
    rain?: number;
    wind_speed_10m?: number;
  };
  daily?: {
    time?: string[];
    precipitation_probability_max?: number[];
    temperature_2m_max?: number[];
  };
};

export type WeatherInsight = {
  location: string;
  temperature: number | null;
  rain: number | null;
  precipitationProbability: number | null;
  windSpeed: number | null;
  recommendation: string;
  severity: 'Normal' | 'Atencao' | 'Critico';
  updatedAt: string | null;
};
