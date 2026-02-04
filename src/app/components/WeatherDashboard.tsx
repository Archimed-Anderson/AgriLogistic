import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Thermometer,
  Droplets,
  Calendar,
  MapPin,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

// Mock weather data
const currentWeather = {
  location: 'Paris, France',
  date: new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
  temperature: 24,
  condition: 'Partiellement nuageux',
  humidity: 65,
  wind: 12,
  feelsLike: 26,
  uvIndex: 6,
  sunrise: '06:45',
  sunset: '20:30',
};

const forecast = [
  { day: 'Lun', temp: 24, condition: 'sunny', icon: Sun },
  { day: 'Mar', temp: 22, condition: 'cloudy', icon: Cloud },
  { day: 'Mer', temp: 19, condition: 'rainy', icon: CloudRain },
  { day: 'Jeu', temp: 21, condition: 'cloudy', icon: Cloud },
  { day: 'Ven', temp: 25, condition: 'sunny', icon: Sun },
  { day: 'Sam', temp: 27, condition: 'sunny', icon: Sun },
  { day: 'Dim', temp: 23, condition: 'cloudy', icon: Cloud },
];

const alerts = [
  { type: 'warning', message: 'Risque de gel nocturne prévu mercredi', time: 'Dans 2 jours' },
  { type: 'info', message: 'Conditions idéales pour la récolte vendredi', time: 'Dans 4 jours' },
];

export function WeatherDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Météo Agricole</h1>
        <p className="text-sm text-gray-500">Prévisions et alertes pour vos exploitations</p>
      </div>

      {/* Current Weather Card */}
      <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm opacity-90">{currentWeather.location}</span>
            </div>
            <p className="text-sm opacity-75 mb-4">{currentWeather.date}</p>

            <div className="flex items-center gap-6">
              <div className="text-6xl font-light">{currentWeather.temperature}°C</div>
              <div>
                <Sun className="w-16 h-16 text-yellow-300" />
              </div>
            </div>

            <p className="text-lg mt-2">{currentWeather.condition}</p>
            <p className="text-sm opacity-75">Ressenti {currentWeather.feelsLike}°C</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Droplets className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs opacity-75">Humidité</p>
              <p className="font-semibold">{currentWeather.humidity}%</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Wind className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs opacity-75">Vent</p>
              <p className="font-semibold">{currentWeather.wind} km/h</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Sun className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs opacity-75">UV Index</p>
              <p className="font-semibold">{currentWeather.uvIndex}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Thermometer className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs opacity-75">Pression</p>
              <p className="font-semibold">1013 hPa</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Alertes Météo</h2>
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-4 rounded-xl ${
                alert.type === 'warning'
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <AlertTriangle
                className={`w-5 h-5 ${
                  alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                }`}
              />
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    alert.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
                  }`}
                >
                  {alert.message}
                </p>
                <p
                  className={`text-sm ${
                    alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                  }`}
                >
                  {alert.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 7-Day Forecast */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Prévisions 7 jours</h2>
          <button className="text-sm text-[#0B7A4B] font-medium hover:underline">Voir plus</button>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {forecast.map((day, _index) => {
            const Icon = day.icon;
            return (
              <div
                key={day.day}
                className="text-center p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm font-medium text-gray-600 mb-2">{day.day}</p>
                <Icon
                  className={`w-8 h-8 mx-auto mb-2 ${
                    day.condition === 'sunny'
                      ? 'text-yellow-500'
                      : day.condition === 'rainy'
                      ? 'text-blue-500'
                      : 'text-gray-400'
                  }`}
                />
                <p className="text-lg font-semibold text-gray-900">{day.temp}°</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agricultural Impact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Croissance</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">Optimal</p>
          <p className="text-sm text-gray-500">Conditions favorables pour vos cultures</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Irrigation</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">Recommandée</p>
          <p className="text-sm text-gray-500">Arrosez dans les 2 prochains jours</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Récolte</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">Vendredi</p>
          <p className="text-sm text-gray-500">Meilleur jour pour récolter</p>
        </div>
      </div>
    </div>
  );
}
