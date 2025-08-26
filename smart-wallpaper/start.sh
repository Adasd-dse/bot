#!/bin/bash

echo "🎨 Pornire Wallpaper Inteligent..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js nu este instalat!"
    echo "Te rugăm să instalezi Node.js de la: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm nu este instalat!"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "❌ Node.js versiunea 14 sau mai nouă este necesară!"
    echo "Versiunea curentă: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectat"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Instalare dependențe..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Eroare la instalarea dependențelor!"
        exit 1
    fi
    echo "✅ Dependențe instalate cu succes!"
else
    echo "✅ Dependențe deja instalate"
fi

# Start the application
echo "🚀 Pornire aplicație..."
echo "🌐 Deschide http://localhost:3000 în browser"
echo "⏹️  Apasă Ctrl+C pentru a opri aplicația"
echo ""

npm start