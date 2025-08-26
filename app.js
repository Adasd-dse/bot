// Smart Wallpaper App
class SmartWallpaper {
    constructor() {
        this.canvas = document.getElementById('wallpaperCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentMode = 'time';
        this.currentScheme = 'ocean';
        this.settings = {
            autoChange: true,
            changeInterval: 3,
            showTime: true,
            showWeather: true
        };
        this.weatherData = null;
        this.location = null;
        this.lastUpdate = null;
        this.autoChangeTimer = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSettings();
        this.updateDateTime();
        this.generateWallpaper();
        this.checkLocationPermission();
        this.setupPWA();
        
        // Update time every second
        setInterval(() => this.updateDateTime(), 1000);
        
        // Setup auto-change
        if (this.settings.autoChange) {
            this.setupAutoChange();
        }
    }

    setupEventListeners() {
        // Mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentMode = btn.dataset.mode;
                this.generateWallpaper();
            });
        });

        // Color schemes
        document.querySelectorAll('.color-scheme').forEach(scheme => {
            scheme.addEventListener('click', (e) => {
                document.querySelectorAll('.color-scheme').forEach(s => s.classList.remove('active'));
                scheme.classList.add('active');
                this.currentScheme = scheme.dataset.scheme;
                this.generateWallpaper();
            });
        });

        // Settings
        document.getElementById('autoChange').addEventListener('change', (e) => {
            this.settings.autoChange = e.target.checked;
            this.saveSettings();
            if (e.target.checked) {
                this.setupAutoChange();
            } else {
                this.clearAutoChange();
            }
        });

        document.getElementById('changeInterval').addEventListener('change', (e) => {
            this.settings.changeInterval = parseInt(e.target.value);
            this.saveSettings();
            if (this.settings.autoChange) {
                this.setupAutoChange();
            }
        });

        document.getElementById('showTime').addEventListener('change', (e) => {
            this.settings.showTime = e.target.checked;
            this.saveSettings();
            document.querySelector('.preview-overlay').style.display = e.target.checked ? 'block' : 'none';
        });

        document.getElementById('showWeather').addEventListener('change', (e) => {
            this.settings.showWeather = e.target.checked;
            this.saveSettings();
            document.getElementById('weatherDisplay').style.display = e.target.checked ? 'flex' : 'none';
        });

        // Action buttons
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadWallpaper());
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.generateWallpaper();
            this.showToast('Wallpaper regenerat!', 'success');
        });

        // Location permission
        document.getElementById('allowLocationBtn').addEventListener('click', () => this.requestLocation());
    }

    // Color Schemes
    getColorScheme() {
        const schemes = {
            ocean: {
                colors: ['#667eea', '#764ba2', '#3182ce', '#5a67d8'],
                gradient: ['#667eea', '#764ba2']
            },
            sunset: {
                colors: ['#f093fb', '#f5576c', '#fa709a', '#feca57'],
                gradient: ['#f093fb', '#f5576c']
            },
            forest: {
                colors: ['#43e97b', '#38f9d7', '#4facfe', '#00f2fe'],
                gradient: ['#43e97b', '#38f9d7']
            },
            night: {
                colors: ['#0f0c29', '#302b63', '#24243e', '#16141f'],
                gradient: ['#0f0c29', '#302b63', '#24243e']
            }
        };
        return schemes[this.currentScheme] || schemes.ocean;
    }

    // Generate wallpaper based on mode
    generateWallpaper() {
        switch (this.currentMode) {
            case 'time':
                this.generateTimeBasedWallpaper();
                break;
            case 'weather':
                this.generateWeatherBasedWallpaper();
                break;
            case 'mood':
                this.generateMoodWallpaper();
                break;
            case 'abstract':
                this.generateAbstractWallpaper();
                break;
        }
    }

    // Time-based wallpaper
    generateTimeBasedWallpaper() {
        const hour = new Date().getHours();
        const scheme = this.getColorScheme();
        let colors;

        // Adjust colors based on time of day
        if (hour >= 5 && hour < 8) {
            // Dawn
            colors = ['#ffd89b', '#19547b', '#ffc371', '#ff5f6d'];
        } else if (hour >= 8 && hour < 12) {
            // Morning
            colors = scheme.colors;
        } else if (hour >= 12 && hour < 17) {
            // Afternoon
            colors = ['#ffd89b', '#19547b', '#667eea', '#764ba2'];
        } else if (hour >= 17 && hour < 20) {
            // Evening
            colors = ['#f093fb', '#f5576c', '#4e54c8', '#8f94fb'];
        } else {
            // Night
            colors = ['#0f0c29', '#302b63', '#24243e', '#000428'];
        }

        this.drawGradientBackground(colors);
        this.addTimeBasedElements(hour);
    }

    // Weather-based wallpaper
    generateWeatherBasedWallpaper() {
        if (!this.weatherData) {
            this.generateTimeBasedWallpaper();
            return;
        }

        const weather = this.weatherData.weather[0].main.toLowerCase();
        let colors;

        switch (weather) {
            case 'clear':
                colors = ['#56CCF2', '#2F80ED', '#00c6fb', '#005bea'];
                break;
            case 'clouds':
                colors = ['#bdc3c7', '#2c3e50', '#606c88', '#3f4c6b'];
                break;
            case 'rain':
                colors = ['#2c3e50', '#3498db', '#1e3c72', '#2a5298'];
                break;
            case 'snow':
                colors = ['#e6e9f0', '#eef1f5', '#d5d5d5', '#e3e3e3'];
                break;
            default:
                colors = this.getColorScheme().colors;
        }

        this.drawGradientBackground(colors);
        this.addWeatherElements(weather);
    }

    // Mood-based wallpaper
    generateMoodWallpaper() {
        const moods = ['happy', 'calm', 'energetic', 'focused'];
        const mood = moods[Math.floor(Math.random() * moods.length)];
        let colors;

        switch (mood) {
            case 'happy':
                colors = ['#f7b733', '#fc4a1a', '#fdbb2d', '#22c1c3'];
                break;
            case 'calm':
                colors = ['#667eea', '#764ba2', '#b993d6', '#8ca6db'];
                break;
            case 'energetic':
                colors = ['#f953c6', '#b91d73', '#ee0979', '#ff6a00'];
                break;
            case 'focused':
                colors = ['#1a2980', '#26d0ce', '#2948ff', '#396afc'];
                break;
        }

        this.drawGradientBackground(colors);
        this.addMoodElements(mood);
    }

    // Abstract wallpaper
    generateAbstractWallpaper() {
        const scheme = this.getColorScheme();
        this.drawGradientBackground(scheme.colors);
        
        // Add abstract shapes
        for (let i = 0; i < 5; i++) {
            this.drawAbstractShape();
        }
        
        // Add particles
        this.addParticles();
    }

    // Drawing functions
    drawGradientBackground(colors) {
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        colors.forEach((color, index) => {
            gradient.addColorStop(index / (colors.length - 1), color);
        });
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawAbstractShape() {
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height;
        const radius = Math.random() * 200 + 50;
        const opacity = Math.random() * 0.3 + 0.1;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        this.ctx.fill();
        
        // Add blur effect
        this.ctx.filter = 'blur(40px)';
        this.ctx.fill();
        this.ctx.filter = 'none';
    }

    addParticles() {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 3 + 1;
            const opacity = Math.random() * 0.5 + 0.3;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.fill();
        }
    }

    addTimeBasedElements(hour) {
        if (hour >= 6 && hour < 18) {
            // Sun
            this.drawSun();
        } else {
            // Moon and stars
            this.drawMoon();
            this.drawStars();
        }
    }

    drawSun() {
        const centerX = this.canvas.width * 0.8;
        const centerY = this.canvas.height * 0.2;
        const radius = 60;
        
        // Sun glow
        const glowGradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 2);
        glowGradient.addColorStop(0, 'rgba(255, 223, 0, 0.8)');
        glowGradient.addColorStop(1, 'rgba(255, 223, 0, 0)');
        
        this.ctx.fillStyle = glowGradient;
        this.ctx.fillRect(centerX - radius * 2, centerY - radius * 2, radius * 4, radius * 4);
        
        // Sun core
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fill();
    }

    drawMoon() {
        const centerX = this.canvas.width * 0.8;
        const centerY = this.canvas.height * 0.2;
        const radius = 50;
        
        // Moon glow
        const glowGradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 2);
        glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = glowGradient;
        this.ctx.fillRect(centerX - radius * 2, centerY - radius * 2, radius * 4, radius * 4);
        
        // Moon
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#F8F8FF';
        this.ctx.fill();
        
        // Moon crater
        this.ctx.beginPath();
        this.ctx.arc(centerX - 10, centerY - 10, radius * 0.8, 0, Math.PI * 2);
        this.ctx.fillStyle = '#E8E8E8';
        this.ctx.fill();
    }

    drawStars() {
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height * 0.6;
            const size = Math.random() * 2;
            const opacity = Math.random() * 0.8 + 0.2;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.fill();
        }
    }

    addWeatherElements(weather) {
        switch (weather) {
            case 'rain':
                this.drawRain();
                break;
            case 'snow':
                this.drawSnow();
                break;
            case 'clouds':
                this.drawClouds();
                break;
        }
    }

    drawRain() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const length = Math.random() * 20 + 10;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x - 2, y + length);
            this.ctx.stroke();
        }
    }

    drawSnow() {
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 4 + 2;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.fill();
        }
    }

    drawClouds() {
        for (let i = 0; i < 3; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height * 0.3;
            this.drawCloud(x, y);
        }
    }

    drawCloud(x, y) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        
        // Cloud puffs
        const sizes = [40, 50, 60, 50, 40];
        const positions = [
            { x: x, y: y },
            { x: x + 25, y: y - 10 },
            { x: x + 50, y: y },
            { x: x + 75, y: y - 10 },
            { x: x + 100, y: y }
        ];
        
        positions.forEach((pos, index) => {
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, sizes[index], 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    addMoodElements(mood) {
        switch (mood) {
            case 'happy':
                this.drawHappyElements();
                break;
            case 'calm':
                this.drawCalmElements();
                break;
            case 'energetic':
                this.drawEnergeticElements();
                break;
            case 'focused':
                this.drawFocusedElements();
                break;
        }
    }

    drawHappyElements() {
        // Confetti-like particles
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 10 + 5;
            const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
            
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, size, size / 2);
        }
    }

    drawCalmElements() {
        // Soft waves
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 3;
        
        for (let i = 0; i < 5; i++) {
            this.ctx.beginPath();
            const y = this.canvas.height * (0.3 + i * 0.15);
            
            for (let x = 0; x < this.canvas.width; x += 10) {
                const waveY = y + Math.sin(x * 0.02 + i) * 20;
                if (x === 0) {
                    this.ctx.moveTo(x, waveY);
                } else {
                    this.ctx.lineTo(x, waveY);
                }
            }
            
            this.ctx.stroke();
        }
    }

    drawEnergeticElements() {
        // Dynamic lines
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 2;
        
        for (let i = 0; i < 20; i++) {
            const startX = Math.random() * this.canvas.width;
            const startY = Math.random() * this.canvas.height;
            const endX = startX + (Math.random() - 0.5) * 200;
            const endY = startY + (Math.random() - 0.5) * 200;
            
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
        }
    }

    drawFocusedElements() {
        // Concentric circles
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 2;
        
        for (let i = 0; i < 10; i++) {
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, 50 + i * 50, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }

    // Date and time
    updateDateTime() {
        const now = new Date();
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
        
        document.getElementById('timeDisplay').textContent = now.toLocaleTimeString('ro-RO', timeOptions);
        document.getElementById('dateDisplay').textContent = now.toLocaleDateString('ro-RO', dateOptions);
    }

    // Weather API
    async checkLocationPermission() {
        if ('geolocation' in navigator) {
            navigator.permissions.query({ name: 'geolocation' }).then(result => {
                if (result.state === 'denied') {
                    document.getElementById('locationPermission').style.display = 'block';
                } else if (result.state === 'granted') {
                    this.requestLocation();
                }
            });
        }
    }

    requestLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.location = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };
                    this.fetchWeatherData();
                    document.getElementById('locationPermission').style.display = 'none';
                },
                error => {
                    console.error('Location error:', error);
                    this.showToast('Nu s-a putut obține locația', 'error');
                }
            );
        }
    }

    async fetchWeatherData() {
        if (!this.location) return;
        
        try {
            // Using OpenWeatherMap API (you need to get your own API key)
            const API_KEY = 'YOUR_API_KEY'; // Replace with your API key
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.location.lat}&lon=${this.location.lon}&appid=${API_KEY}&units=metric`);
            
            if (response.ok) {
                this.weatherData = await response.json();
                this.updateWeatherDisplay();
            }
        } catch (error) {
            console.error('Weather fetch error:', error);
        }
    }

    updateWeatherDisplay() {
        if (!this.weatherData) return;
        
        const temp = Math.round(this.weatherData.main.temp);
        const weather = this.weatherData.weather[0].main.toLowerCase();
        
        const weatherIcons = {
            clear: 'fa-sun',
            clouds: 'fa-cloud',
            rain: 'fa-cloud-rain',
            snow: 'fa-snowflake',
            thunderstorm: 'fa-bolt',
            drizzle: 'fa-cloud-rain',
            mist: 'fa-smog',
            fog: 'fa-smog'
        };
        
        const icon = weatherIcons[weather] || 'fa-cloud';
        const weatherDisplay = document.getElementById('weatherDisplay');
        weatherDisplay.innerHTML = `<i class="fas ${icon}"></i><span>${temp}°C</span>`;
        
        if (this.currentMode === 'weather') {
            this.generateWallpaper();
        }
    }

    // Download functionality
    downloadWallpaper() {
        // Create a temporary canvas without overlay
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Copy the wallpaper
        tempCtx.drawImage(this.canvas, 0, 0);
        
        // Add time and weather if enabled
        if (this.settings.showTime || this.settings.showWeather) {
            tempCtx.font = 'bold 120px Inter';
            tempCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            tempCtx.textAlign = 'center';
            tempCtx.textBaseline = 'middle';
            
            if (this.settings.showTime) {
                const time = document.getElementById('timeDisplay').textContent;
                tempCtx.fillText(time, tempCanvas.width / 2, tempCanvas.height / 2 - 100);
                
                tempCtx.font = '40px Inter';
                const date = document.getElementById('dateDisplay').textContent;
                tempCtx.fillText(date, tempCanvas.width / 2, tempCanvas.height / 2);
            }
            
            if (this.settings.showWeather && this.weatherData) {
                tempCtx.font = '60px Inter';
                const temp = Math.round(this.weatherData.main.temp);
                tempCtx.fillText(`${temp}°C`, tempCanvas.width / 2, tempCanvas.height / 2 + 100);
            }
        }
        
        // Download
        tempCanvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `smart-wallpaper-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
            
            this.showToast('Wallpaper descărcat!', 'success');
        });
    }

    // Auto-change functionality
    setupAutoChange() {
        this.clearAutoChange();
        
        const intervalMs = this.settings.changeInterval * 60 * 60 * 1000; // Convert hours to ms
        this.autoChangeTimer = setInterval(() => {
            this.generateWallpaper();
            this.showToast('Wallpaper actualizat automat', 'info');
        }, intervalMs);
    }

    clearAutoChange() {
        if (this.autoChangeTimer) {
            clearInterval(this.autoChangeTimer);
            this.autoChangeTimer = null;
        }
    }

    // Settings persistence
    saveSettings() {
        localStorage.setItem('smartWallpaperSettings', JSON.stringify(this.settings));
    }

    loadSettings() {
        const saved = localStorage.getItem('smartWallpaperSettings');
        if (saved) {
            this.settings = JSON.parse(saved);
            
            // Update UI
            document.getElementById('autoChange').checked = this.settings.autoChange;
            document.getElementById('changeInterval').value = this.settings.changeInterval;
            document.getElementById('showTime').checked = this.settings.showTime;
            document.getElementById('showWeather').checked = this.settings.showWeather;
            
            // Apply visibility settings
            document.querySelector('.preview-overlay').style.display = this.settings.showTime ? 'block' : 'none';
            document.getElementById('weatherDisplay').style.display = this.settings.showWeather ? 'flex' : 'none';
        }
    }

    // Toast notifications
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.getElementById('toastContainer').appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // PWA functionality
    setupPWA() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            document.getElementById('installBtn').style.display = 'flex';
        });
        
        document.getElementById('installBtn').addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                
                if (outcome === 'accepted') {
                    this.showToast('Aplicație instalată cu succes!', 'success');
                    document.getElementById('installBtn').style.display = 'none';
                }
                
                deferredPrompt = null;
            }
        });
        
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(error => {
                console.error('Service Worker registration failed:', error);
            });
        }
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new SmartWallpaper();
});