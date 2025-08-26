const express = require('express');
const { createCanvas } = require('canvas');
const moment = require('moment');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Generate wallpaper based on time and preferences
app.post('/generate-wallpaper', (req, res) => {
    try {
        const { theme, time, weather, mood } = req.body;
        
        // Create canvas with phone dimensions (1080x1920 for most phones)
        const canvas = createCanvas(1080, 1920);
        const ctx = canvas.getContext('2d');
        
        // Generate wallpaper based on theme and time
        generateWallpaper(ctx, theme, time, weather, mood);
        
        // Convert to buffer and send
        const buffer = canvas.toBuffer('image/png');
        res.set('Content-Type', 'image/png');
        res.send(buffer);
        
    } catch (error) {
        console.error('Error generating wallpaper:', error);
        res.status(500).json({ error: 'Failed to generate wallpaper' });
    }
});

function generateWallpaper(ctx, theme, time, weather, mood) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Get current time if not provided
    const currentTime = time || moment();
    const hour = currentTime.hour();
    
    // Choose color scheme based on time and theme
    let colors = getColorScheme(theme, hour, weather, mood);
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(1, colors.secondary);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add geometric patterns
    addGeometricPatterns(ctx, width, height, colors, theme);
    
    // Add time-based elements
    addTimeElements(ctx, width, height, currentTime, colors);
    
    // Add weather elements if available
    if (weather) {
        addWeatherElements(ctx, width, height, weather, colors);
    }
    
    // Add mood elements
    addMoodElements(ctx, width, height, mood, colors);
}

function getColorScheme(theme, hour, weather, mood) {
    let colors = {};
    
    // Time-based colors
    if (hour >= 6 && hour < 12) {
        // Morning - warm, bright colors
        colors.primary = '#FFD700'; // Gold
        colors.secondary = '#FFA500'; // Orange
        colors.accent = '#FF6347'; // Tomato
    } else if (hour >= 12 && hour < 18) {
        // Afternoon - vibrant colors
        colors.primary = '#00CED1'; // Dark Turquoise
        colors.secondary = '#32CD32'; // Lime Green
        colors.accent = '#FF4500'; // Orange Red
    } else if (hour >= 18 && hour < 22) {
        // Evening - warm, sunset colors
        colors.primary = '#FF8C00'; // Dark Orange
        colors.secondary = '#FF1493'; // Deep Pink
        colors.accent = '#8A2BE2'; // Blue Violet
    } else {
        // Night - cool, dark colors
        colors.primary = '#191970'; // Midnight Blue
        colors.secondary = '#4B0082'; // Indigo
        colors.accent = '#9370DB'; // Medium Purple
    }
    
    // Theme overrides
    if (theme === 'nature') {
        colors.primary = '#228B22'; // Forest Green
        colors.secondary = '#32CD32'; // Lime Green
    } else if (theme === 'ocean') {
        colors.primary = '#1E90FF'; // Dodger Blue
        colors.secondary = '#00CED1'; // Dark Turquoise
    } else if (theme === 'sunset') {
        colors.primary = '#FF4500'; // Orange Red
        colors.secondary = '#FF1493'; // Deep Pink
    }
    
    return colors;
}

function addGeometricPatterns(ctx, width, height, colors, theme) {
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3;
    
    // Draw geometric shapes based on theme
    if (theme === 'minimal') {
        // Simple lines
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(0, height * (i + 1) / 6);
            ctx.lineTo(width, height * (i + 1) / 6);
            ctx.stroke();
        }
    } else if (theme === 'geometric') {
        // Triangles and circles
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 50 + Math.random() * 100;
            
            if (Math.random() > 0.5) {
                // Triangle
                ctx.beginPath();
                ctx.moveTo(x, y - size/2);
                ctx.lineTo(x - size/2, y + size/2);
                ctx.lineTo(x + size/2, y + size/2);
                ctx.closePath();
                ctx.stroke();
            } else {
                // Circle
                ctx.beginPath();
                ctx.arc(x, y, size/2, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
    }
    
    ctx.globalAlpha = 1;
}

function addTimeElements(ctx, width, height, time, colors) {
    const timeString = time.format('HH:mm');
    const dateString = time.format('dddd, MMMM Do');
    
    ctx.fillStyle = colors.accent;
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    
    // Time
    ctx.fillText(timeString, width/2, height/2 - 50);
    
    // Date
    ctx.font = '36px Arial';
    ctx.fillText(dateString, width/2, height/2 + 50);
}

function addWeatherElements(ctx, width, height, weather, colors) {
    // Simple weather icon representation
    const iconSize = 100;
    const x = width - 150;
    const y = 150;
    
    ctx.fillStyle = colors.accent;
    
    if (weather.condition === 'sunny') {
        // Sun
        ctx.beginPath();
        ctx.arc(x, y, iconSize/2, 0, 2 * Math.PI);
        ctx.fill();
        
        // Sun rays
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const rayLength = 30;
            ctx.beginPath();
            ctx.moveTo(
                x + Math.cos(angle) * (iconSize/2 + 10),
                y + Math.sin(angle) * (iconSize/2 + 10)
            );
            ctx.lineTo(
                x + Math.cos(angle) * (iconSize/2 + rayLength),
                y + Math.sin(angle) * (iconSize/2 + rayLength)
            );
            ctx.stroke();
        }
    } else if (weather.condition === 'rainy') {
        // Rain drops
        for (let i = 0; i < 10; i++) {
            const dropX = x - 30 + Math.random() * 60;
            const dropY = y - 30 + i * 15;
            ctx.beginPath();
            ctx.moveTo(dropX, dropY);
            ctx.lineTo(dropX, dropY + 20);
            ctx.stroke();
        }
    }
    
    // Temperature
    ctx.font = '48px Arial';
    ctx.fillText(`${weather.temperature}°C`, x, y + 150);
}

function addMoodElements(ctx, width, height, mood, colors) {
    // Add mood-based visual elements
    if (mood === 'happy') {
        // Smiley face
        const x = width/2;
        const y = height - 200;
        const size = 80;
        
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 4;
        
        // Face circle
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Eyes
        ctx.beginPath();
        ctx.arc(x - 25, y - 20, 8, 0, 2 * Math.PI);
        ctx.arc(x + 25, y - 20, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Smile
        ctx.beginPath();
        ctx.arc(x, y, size * 0.6, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();
    }
}

app.listen(PORT, () => {
    console.log(`Smart Wallpaper server running on port ${PORT}`);
});