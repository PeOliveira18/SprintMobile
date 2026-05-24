import axios from 'axios';

import { OpenMeteoResponse, WeatherInsight } from '@/types/weather';

const weatherApi = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 8000,
});

const SAO_PAULO = {
  name: 'Sao Paulo - SP',
  latitude: -23.55,
  longitude: -46.63,
};

export const weatherService = {
  async findFordOneWeatherInsight(): Promise<WeatherInsight> {
    const response = await weatherApi.get<OpenMeteoResponse>('/forecast', {
      params: {
        latitude: SAO_PAULO.latitude,
        longitude: SAO_PAULO.longitude,
        current: 'temperature_2m,precipitation,rain,wind_speed_10m',
        daily: 'precipitation_probability_max,temperature_2m_max',
        timezone: 'America/Sao_Paulo',
      },
    });

    return mapWeatherInsight(response.data);
  },
};

function mapWeatherInsight(data: OpenMeteoResponse): WeatherInsight {
  const temperature = data.current?.temperature_2m ?? null;
  const rain = data.current?.rain ?? data.current?.precipitation ?? null;
  const precipitationProbability = data.daily?.precipitation_probability_max?.[0] ?? null;
  const windSpeed = data.current?.wind_speed_10m ?? null;
  const severity = getWeatherSeverity(temperature, rain, precipitationProbability, windSpeed);

  return {
    location: SAO_PAULO.name,
    temperature,
    rain,
    precipitationProbability,
    windSpeed,
    severity,
    recommendation: getWeatherRecommendation(severity, temperature, rain, precipitationProbability, windSpeed),
    updatedAt: data.current?.time ?? null,
  };
}

function getWeatherSeverity(
  temperature: number | null,
  rain: number | null,
  precipitationProbability: number | null,
  windSpeed: number | null,
): WeatherInsight['severity'] {
  if ((rain ?? 0) >= 8 || (precipitationProbability ?? 0) >= 80 || (windSpeed ?? 0) >= 45) {
    return 'Critico';
  }

  if ((rain ?? 0) > 0 || (precipitationProbability ?? 0) >= 55 || (temperature ?? 0) >= 32) {
    return 'Atencao';
  }

  return 'Normal';
}

function getWeatherRecommendation(
  severity: WeatherInsight['severity'],
  temperature: number | null,
  rain: number | null,
  precipitationProbability: number | null,
  windSpeed: number | null,
) {
  if ((rain ?? 0) > 0 || (precipitationProbability ?? 0) >= 55) {
    return 'Previsao de chuva na regiao. Recomende checagem de pneus, freios e palhetas antes do proximo deslocamento.';
  }

  if ((temperature ?? 0) >= 32) {
    return 'Temperatura elevada. Recomende revisao de bateria, ar-condicionado e fluidos do veiculo.';
  }

  if ((windSpeed ?? 0) >= 30) {
    return 'Vento acima do normal. Recomende calibragem de pneus e atencao ao planejamento de rota.';
  }

  if (severity === 'Critico') {
    return 'Condicoes externas severas. Priorize contato preventivo com clientes em risco.';
  }

  return 'Condicoes externas estaveis. Mantenha o acompanhamento preventivo da telemetria.';
}
