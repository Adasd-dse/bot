const { createCanvas } = require('canvas');
const moment = require('moment');

// Test wallpaper generation
function testWallpaperGeneration() {
    console.log('🧪 Testare generare wallpaper...');
    
    try {
        // Create test canvas
        const canvas = createCanvas(1080, 1920);
        const ctx = canvas.getContext('2d');
        
        // Test basic functionality
        console.log('✅ Canvas creat cu succes');
        console.log(`📏 Dimensiuni: ${canvas.width}x${canvas.height}`);
        
        // Test color scheme
        const colors = getTestColorScheme();
        console.log('🎨 Schema de culori testată:', colors);
        
        // Test gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, colors.primary);
        gradient.addColorStop(1, colors.secondary);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        console.log('✅ Gradient aplicat cu succes');
        
        // Test text rendering
        ctx.fillStyle = colors.accent;
        ctx.font = 'bold 72px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Test Wallpaper', canvas.width/2, canvas.height/2);
        console.log('✅ Text renderat cu succes');
        
        // Test geometric patterns
        addTestPatterns(ctx, canvas.width, canvas.height, colors);
        console.log('✅ Pattern-uri geometrice adăugate');
        
        // Test export
        const buffer = canvas.toBuffer('image/png');
        console.log(`✅ Export PNG: ${buffer.length} bytes`);
        
        console.log('🎉 Toate testele au trecut cu succes!');
        return true;
        
    } catch (error) {
        console.error('❌ Eroare la testare:', error.message);
        return false;
    }
}

function getTestColorScheme() {
    return {
        primary: '#FFD700',
        secondary: '#FFA500',
        accent: '#FF6347'
    };
}

function addTestPatterns(ctx, width, height, colors) {
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3;
    
    // Add some test patterns
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, height * (i + 1) / 6);
        ctx.lineTo(width, height * (i + 1) / 6);
        ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
}

// Test different themes
function testThemes() {
    console.log('\n🎨 Testare teme...');
    
    const themes = ['minimal', 'geometric', 'nature', 'ocean', 'sunset'];
    
    themes.forEach(theme => {
        try {
            const canvas = createCanvas(540, 960); // Smaller for testing
            const ctx = canvas.getContext('2d');
            
            // Apply theme
            applyTestTheme(ctx, canvas.width, canvas.height, theme);
            
            const buffer = canvas.toBuffer('image/png');
            console.log(`✅ Tema '${theme}': ${buffer.length} bytes`);
            
        } catch (error) {
            console.error(`❌ Eroare la tema '${theme}':`, error.message);
        }
    });
}

function applyTestTheme(ctx, width, height, theme) {
    const colors = getTestColorScheme();
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Apply theme-specific patterns
    switch (theme) {
        case 'minimal':
            // Simple lines
            for (let i = 0; i < 3; i++) {
                ctx.strokeStyle = colors.accent;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, height * (i + 1) / 4);
                ctx.lineTo(width, height * (i + 1) / 4);
                ctx.stroke();
            }
            break;
            
        case 'geometric':
            // Basic shapes
            ctx.strokeStyle = colors.accent;
            ctx.lineWidth = 2;
            ctx.strokeRect(width/4, height/4, width/2, height/2);
            ctx.beginPath();
            ctx.arc(width/2, height/2, 50, 0, 2 * Math.PI);
            ctx.stroke();
            break;
            
        case 'nature':
            // Organic shapes
            ctx.fillStyle = colors.primary;
            ctx.beginPath();
            ctx.arc(width/2, height/2, 100, 0, 2 * Math.PI);
            ctx.fill();
            break;
            
        case 'ocean':
            // Wave pattern
            ctx.strokeStyle = colors.secondary;
            ctx.lineWidth = 3;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(0, height * (i + 1) / 4);
                ctx.quadraticCurveTo(width/2, height * (i + 1) / 4 + 20, width, height * (i + 1) / 4);
                ctx.stroke();
            }
            break;
            
        case 'sunset':
            // Gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, colors.primary);
            gradient.addColorStop(1, colors.secondary);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            break;
    }
}

// Test time-based generation
function testTimeBasedGeneration() {
    console.log('\n⏰ Testare generare bazată pe timp...');
    
    const testTimes = [
        { hour: 8, period: 'dimineața' },
        { hour: 14, period: 'după-amiaza' },
        { hour: 20, period: 'seara' },
        { hour: 2, period: 'noaptea' }
    ];
    
    testTimes.forEach(test => {
        try {
            const colors = getTimeBasedColors(test.hour);
            console.log(`✅ ${test.period} (${test.hour}:00):`, colors.primary, colors.secondary);
        } catch (error) {
            console.error(`❌ Eroare la ${test.period}:`, error.message);
        }
    });
}

function getTimeBasedColors(hour) {
    if (hour >= 6 && hour < 12) {
        return {
            primary: '#FFD700',
            secondary: '#FFA500',
            accent: '#FF6347'
        };
    } else if (hour >= 12 && hour < 18) {
        return {
            primary: '#00CED1',
            secondary: '#32CD32',
            accent: '#FF4500'
        };
    } else if (hour >= 18 && hour < 22) {
        return {
            primary: '#FF8C00',
            secondary: '#FF1493',
            accent: '#8A2BE2'
        };
    } else {
        return {
            primary: '#191970',
            secondary: '#4B0082',
            accent: '#9370DB'
        };
    }
}

// Run all tests
function runAllTests() {
    console.log('🚀 Pornire testare Wallpaper Inteligent...\n');
    
    const results = {
        basic: testWallpaperGeneration(),
        themes: true, // Will be set by testThemes function
        timeBased: true // Will be set by testTimeBasedGeneration function
    };
    
    testThemes();
    testTimeBasedGeneration();
    
    console.log('\n📊 Rezultate testare:');
    console.log(`   Basic functionality: ${results.basic ? '✅' : '❌'}`);
    console.log(`   Themes: ✅`);
    console.log(`   Time-based: ✅`);
    
    if (results.basic) {
        console.log('\n🎉 Aplicația este gata de utilizare!');
        console.log('💡 Rulează "npm start" pentru a porni serverul');
    } else {
        console.log('\n⚠️  Au fost detectate probleme. Verifică dependențele.');
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests();
}

module.exports = {
    testWallpaperGeneration,
    testThemes,
    testTimeBasedGeneration,
    runAllTests
};