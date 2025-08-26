// Exemplu de integrare cu API-uri de vreme reale
// Pentru a utiliza acest fișier, obține un API key de la unul din serviciile de mai jos

const fetch = require('node-fetch');

class WeatherService {
    constructor(apiKey, service = 'openweathermap') {
        this.apiKey = apiKey;
        this.service = service;
        this.baseUrls = {
            openweathermap: 'https://api.openweathermap.org/data/2.5',
            weatherapi: 'https://api.weatherapi.com/v1',
            accuweather: 'http://dataservice.accuweather.com'
        };
    }
    
    // Obține vremea pentru o locație specifică
    async getWeather(lat, lon, city = null) {
        try {
            let weatherData;
            
            switch (this.service) {
                case 'openweathermap':
                    weatherData = await this.getOpenWeatherMapData(lat, lon);
                    break;
                case 'weatherapi':
                    weatherData = await this.getWeatherApiData(city || `${lat},${lon}`);
                    break;
                case 'accuweather':
                    weatherData = await this.getAccuWeatherData(lat, lon);
                    break;
                default:
                    throw new Error('Serviciu de vreme necunoscut');
            }
            
            return this.normalizeWeatherData(weatherData);
            
        } catch (error) {
            console.error('Eroare la obținerea datelor meteo:', error);
            return this.getDefaultWeatherData();
        }
    }
    
    // OpenWeatherMap API
    async getOpenWeatherMapData(lat, lon) {
        const url = `${this.baseUrls.openweathermap}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=ro`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`OpenWeatherMap API error: ${response.status}`);
        }
        
        return await response.json();
    }
    
    // WeatherAPI.com
    async getWeatherApiData(query) {
        const url = `${this.baseUrls.weatherapi}/current.json?key=${this.apiKey}&q=${query}&lang=ro`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`WeatherAPI error: ${response.status}`);
        }
        
        return await response.json();
    }
    
    // AccuWeather API
    async getAccuWeatherData(lat, lon) {
        // Mai întâi obține location key
        const locationUrl = `${this.baseUrls.accuweather}/locations/v1/cities/geoposition/search?apikey=${this.apiKey}&q=${lat},${lon}`;
        const locationResponse = await fetch(locationUrl);
        
        if (!locationResponse.ok) {
            throw new Error(`AccuWeather location error: ${locationResponse.status}`);
        }
        
        const locationData = await locationResponse.json();
        const locationKey = locationData.Key;
        
        // Apoi obține vremea
        const weatherUrl = `${this.baseUrls.accuweather}/currentconditions/v1/${locationKey}?apikey=${this.apiKey}&language=ro`;
        const weatherResponse = await fetch(weatherUrl);
        
        if (!weatherResponse.ok) {
            throw new Error(`AccuWeather weather error: ${weatherResponse.status}`);
        }
        
        return await weatherResponse.json();
    }
    
    // Normalizează datele de la diferite API-uri într-un format comun
    normalizeWeatherData(rawData) {
        let normalized = {
            condition: 'unknown',
            temperature: 20,
            humidity: 50,
            windSpeed: 0,
            description: 'Vreme necunoscută'
        };
        
        try {
            switch (this.service) {
                case 'openweathermap':
                    normalized = this.normalizeOpenWeatherMap(rawData);
                    break;
                case 'weatherapi':
                    normalized = this.normalizeWeatherApi(rawData);
                    break;
                case 'accuweather':
                    normalized = this.normalizeAccuWeather(rawData);
                    break;
            }
        } catch (error) {
            console.error('Eroare la normalizarea datelor:', error);
        }
        
        return normalized;
    }
    
    // Normalizare OpenWeatherMap
    normalizeOpenWeatherMap(data) {
        const weather = data.weather[0];
        const main = data.main;
        const wind = data.wind;
        
        return {
            condition: this.mapWeatherCondition(weather.main, weather.id),
            temperature: Math.round(main.temp),
            humidity: main.humidity,
            windSpeed: Math.round(wind.speed * 3.6), // m/s to km/h
            description: weather.description
        };
    }
    
    // Normalizare WeatherAPI
    normalizeWeatherApi(data) {
        const current = data.current;
        
        return {
            condition: this.mapWeatherCondition(current.condition.text),
            temperature: Math.round(current.temp_c),
            humidity: current.humidity,
            windSpeed: Math.round(current.wind_kph),
            description: current.condition.text
        };
    }
    
    // Normalizare AccuWeather
    normalizeAccuWeather(data) {
        const current = data[0];
        
        return {
            condition: this.mapWeatherCondition(current.WeatherText),
            temperature: Math.round(current.Temperature.Metric.Value),
            humidity: current.RelativeHumidity || 50,
            windSpeed: Math.round(current.Wind.Speed.Metric.Value),
            description: current.WeatherText
        };
    }
    
    // Mapează condițiile meteo la categoriile noastre
    mapWeatherCondition(condition, id = null) {
        const conditionLower = condition.toLowerCase();
        
        // OpenWeatherMap specific mapping
        if (id) {
            if (id >= 200 && id < 300) return 'stormy';
            if (id >= 300 && id < 400) return 'rainy';
            if (id >= 500 && id < 600) return 'rainy';
            if (id >= 600 && id < 700) return 'snowy';
            if (id >= 700 && id < 800) return 'foggy';
            if (id === 800) return 'sunny';
            if (id >= 801 && id < 900) return 'cloudy';
        }
        
        // General text mapping
        if (conditionLower.includes('rain') || conditionLower.includes('ploaie')) return 'rainy';
        if (conditionLower.includes('snow') || conditionLower.includes('zăpadă')) return 'snowy';
        if (conditionLower.includes('cloud') || conditionLower.includes('nor')) return 'cloudy';
        if (conditionLower.includes('fog') || conditionLower.includes('ceață')) return 'foggy';
        if (conditionLower.includes('storm') || conditionLower.includes('furtună')) return 'stormy';
        if (conditionLower.includes('sun') || conditionLower.includes('soare')) return 'sunny';
        if (conditionLower.includes('clear') || conditionLower.includes('senin')) return 'sunny';
        
        return 'unknown';
    }
    
    // Date de vreme implicite pentru cazul în care API-ul eșuează
    getDefaultWeatherData() {
        return {
            condition: 'sunny',
            temperature: 22,
            humidity: 60,
            windSpeed: 5,
            description: 'Vreme frumoasă'
        };
    }
}

// Exemplu de utilizare
async function exampleUsage() {
    // Înlocuiește cu API key-ul tău real
    const weatherService = new WeatherService('YOUR_API_KEY_HERE', 'openweathermap');
    
    try {
        // Exemplu pentru București
        const weather = await weatherService.getWeather(44.4268, 26.1025, 'București');
        console.log('Vremea în București:', weather);
        
        // Integrare cu generarea de wallpaper
        const wallpaperData = {
            theme: 'auto',
            weather: weather,
            mood: 'neutral',
            time: new Date()
        };
        
        console.log('Date pentru wallpaper:', wallpaperData);
        
    } catch (error) {
        console.error('Eroare la exemplul de utilizare:', error);
    }
}

// Configurare pentru diferite servicii
const weatherConfig = {
    openweathermap: {
        name: 'OpenWeatherMap',
        url: 'https://openweathermap.org/api',
        freeTier: '1000 calls/day',
        features: ['Current weather', 'Forecast', 'Maps']
    },
    weatherapi: {
        name: 'WeatherAPI.com',
        url: 'https://www.weatherapi.com',
        freeTier: '1 million calls/month',
        features: ['Current weather', 'Forecast', 'History', 'Astronomy']
    },
    accuweather: {
        name: 'AccuWeather',
        url: 'https://developer.accuweather.com',
        freeTier: '50 calls/day',
        features: ['Current conditions', 'Forecast', 'Indices']
    }
};

// Funcție pentru a obține vremea bazată pe locația utilizatorului
async function getUserLocationWeather() {
    if (navigator.geolocation) {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const weatherService = new WeatherService('YOUR_API_KEY_HERE');
                        const weather = await weatherService.getWeather(latitude, longitude);
                        resolve(weather);
                    } catch (error) {
                        reject(error);
                    }
                },
                (error) => {
                    reject(error);
                }
            );
        });
    } else {
        throw new Error('Geolocația nu este suportată de acest browser');
    }
}

module.exports = {
    WeatherService,
    weatherConfig,
    exampleUsage,
    getUserLocationWeather
};

// Rulare exemplu dacă fișierul este executat direct
if (require.main === module) {
    console.log('🌤️  Exemplu integrare API vreme');
    console.log('================================');
    console.log('Configurare servicii disponibile:');
    
    Object.entries(weatherConfig).forEach(([key, config]) => {
        console.log(`\n${config.name}:`);
        console.log(`  URL: ${config.url}`);
        console.log(`  Free Tier: ${config.freeTier}`);
        console.log(`  Features: ${config.features.join(', ')}`);
    });
    
    console.log('\n⚠️  Pentru a testa integrarea reală:');
    console.log('1. Obține un API key de la unul din serviciile de mai sus');
    console.log('2. Înlocuiește "YOUR_API_KEY_HERE" cu cheia ta');
    console.log('3. Rulează exampleUsage()');
}