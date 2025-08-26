module.exports = {
    // Server configuration
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || '0.0.0.0'
    },
    
    // Canvas configuration
    canvas: {
        width: 1080,
        height: 1920,
        quality: 'high' // 'low', 'medium', 'high'
    },
    
    // Color schemes for different times
    timeColors: {
        morning: {
            start: 6,
            end: 12,
            primary: '#FFD700',
            secondary: '#FFA500',
            accent: '#FF6347'
        },
        afternoon: {
            start: 12,
            end: 18,
            primary: '#00CED1',
            secondary: '#32CD32',
            accent: '#FF4500'
        },
        evening: {
            start: 18,
            end: 22,
            primary: '#FF8C00',
            secondary: '#FF1493',
            accent: '#8A2BE2'
        },
        night: {
            start: 22,
            end: 6,
            primary: '#191970',
            secondary: '#4B0082',
            accent: '#9370DB'
        }
    },
    
    // Theme configurations
    themes: {
        minimal: {
            patterns: 'lines',
            complexity: 'low',
            opacity: 0.3
        },
        geometric: {
            patterns: 'shapes',
            complexity: 'high',
            opacity: 0.4
        },
        nature: {
            patterns: 'organic',
            complexity: 'medium',
            opacity: 0.5
        },
        ocean: {
            patterns: 'waves',
            complexity: 'medium',
            opacity: 0.4
        },
        sunset: {
            patterns: 'gradient',
            complexity: 'low',
            opacity: 0.6
        }
    },
    
    // Weather configurations
    weather: {
        sunny: {
            icon: 'sun',
            colors: ['#FFD700', '#FFA500'],
            effects: ['rays', 'glow']
        },
        rainy: {
            icon: 'rain',
            colors: ['#87CEEB', '#4682B4'],
            effects: ['drops', 'clouds']
        },
        cloudy: {
            icon: 'cloud',
            colors: ['#B0C4DE', '#778899'],
            effects: ['shadows', 'texture']
        }
    },
    
    // Mood configurations
    moods: {
        happy: {
            elements: ['smiley', 'stars'],
            colors: ['#FFD700', '#FF69B4'],
            animation: 'bounce'
        },
        calm: {
            elements: ['waves', 'circles'],
            colors: ['#98FB98', '#87CEEB'],
            animation: 'float'
        },
        energetic: {
            elements: ['lightning', 'zigzag'],
            colors: ['#FF4500', '#FFD700'],
            animation: 'pulse'
        },
        neutral: {
            elements: ['dots', 'lines'],
            colors: ['#808080', '#C0C0C0'],
            animation: 'none'
        }
    },
    
    // Auto-generation settings
    autoGeneration: {
        enabled: true,
        interval: 3600000, // 1 hour in milliseconds
        conditions: {
            theme: 'auto',
            mood: 'neutral',
            weather: 'auto'
        }
    },
    
    // Export settings
    export: {
        format: 'png',
        quality: 0.9,
        filename: 'wallpaper-inteligent-{date}',
        includeMetadata: true
    },
    
    // Performance settings
    performance: {
        cacheEnabled: true,
        cacheSize: 100,
        maxConcurrentGenerations: 5,
        timeout: 30000 // 30 seconds
    }
};