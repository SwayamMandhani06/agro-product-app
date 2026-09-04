import type { WeatherCondition, HourlyForecast, DailyForecast, FarmAdvisory } from '@/types';

export const CURRENT_WEATHER: WeatherCondition = {
  location: 'Pune Regional Agricultural Zone',
  state: 'Maharashtra',
  temperature: 28.5,
  feelsLike: 31.0,
  humidity: 74,
  windSpeedKmH: 14.2,
  visibilityKm: 9.5,
  rainProbability: 65,
  conditionText: 'Scattered Monsoon Clouds',
  uvIndex: 6,
  updatedAt: '15 mins ago (IMD Agro-met Station)',
};

export const HOURLY_FORECASTS: HourlyForecast[] = [
  { time: '06:00', temperature: 24.0, rainProbability: 20, windSpeedKmH: 8, condition: 'cloudy' },
  { time: '09:00', temperature: 27.2, rainProbability: 35, windSpeedKmH: 11, condition: 'cloudy' },
  { time: '12:00', temperature: 30.5, rainProbability: 55, windSpeedKmH: 16, condition: 'rain' },
  { time: '15:00', temperature: 29.0, rainProbability: 70, windSpeedKmH: 18, condition: 'thunder' },
  { time: '18:00', temperature: 26.8, rainProbability: 60, windSpeedKmH: 14, condition: 'rain' },
  { time: '21:00', temperature: 25.1, rainProbability: 40, windSpeedKmH: 10, condition: 'cloudy' },
  { time: '00:00', temperature: 23.8, rainProbability: 25, windSpeedKmH: 9, condition: 'cloudy' },
];

export const DAILY_FORECASTS: DailyForecast[] = [
  { day: 'Today', date: 'Thu, Sep 3', tempHigh: 30, tempLow: 23, rainProbability: 65, condition: 'rain' },
  { day: 'Tomorrow', date: 'Fri, Sep 4', tempHigh: 29, tempLow: 22, rainProbability: 80, condition: 'thunder' },
  { day: 'Saturday', date: 'Sat, Sep 5', tempHigh: 31, tempLow: 23, rainProbability: 45, condition: 'cloudy' },
  { day: 'Sunday', date: 'Sun, Sep 6', tempHigh: 32, tempLow: 24, rainProbability: 20, condition: 'sunny' },
  { day: 'Monday', date: 'Mon, Sep 7', tempHigh: 33, tempLow: 24, rainProbability: 15, condition: 'sunny' },
  { day: 'Tuesday', date: 'Tue, Sep 8', tempHigh: 32, tempLow: 23, rainProbability: 30, condition: 'cloudy' },
  { day: 'Wednesday', date: 'Wed, Sep 9', tempHigh: 30, tempLow: 22, rainProbability: 60, condition: 'rain' },
];

export const FARM_ADVISORIES: FarmAdvisory[] = [
  {
    id: 'adv_1',
    severity: 'critical',
    title: 'Postpone Foliar & Chemical Spraying',
    advice: 'Wind speeds exceeding 15 km/h and 65% precipitation probability will cause spray drift and wash-off. Reschedule protective pesticide applications to Sunday morning.',
    category: 'Spraying',
  },
  {
    id: 'adv_2',
    severity: 'warning',
    title: 'Drain Standing Water from Pulse & Vegetable Beds',
    advice: 'High rainfall expected over the next 48 hours. Clear drainage channels to avoid root asphyxiation and damping-off fungus in young soybean and tomato seedlings.',
    category: 'Field Prep',
  },
  {
    id: 'adv_3',
    severity: 'info',
    title: 'Suspend Micro-Irrigation Cycles',
    advice: 'Adequate soil root-zone moisture saturation (>80% field capacity). Cut off drip fertigation for 48 hours to conserve pump electricity and avoid nutrient leaching.',
    category: 'Irrigation',
  },
];

export interface WeatherRepository {
  getCurrentConditions(): Promise<WeatherCondition>;
  getHourlyForecast(): Promise<HourlyForecast[]>;
  getDailyForecast(): Promise<DailyForecast[]>;
  getFarmAdvisories(): Promise<FarmAdvisory[]>;
}

export class MockWeatherRepository implements WeatherRepository {
  async getCurrentConditions(): Promise<WeatherCondition> {
    return CURRENT_WEATHER;
  }

  async getHourlyForecast(): Promise<HourlyForecast[]> {
    return HOURLY_FORECASTS;
  }

  async getDailyForecast(): Promise<DailyForecast[]> {
    return DAILY_FORECASTS;
  }

  async getFarmAdvisories(): Promise<FarmAdvisory[]> {
    return FARM_ADVISORIES;
  }
}

export const weatherRepository: WeatherRepository = new MockWeatherRepository();
