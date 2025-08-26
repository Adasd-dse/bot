# 🚀 Pornire Rapidă - Wallpaper Inteligent

## ⚡ Pornire în 3 pași

### 1. Instalează dependențele
```bash
cd smart-wallpaper
npm install
```

### 2. Pornește aplicația
```bash
npm start
```

### 3. Deschide în browser
Navighează la: `http://localhost:3000`

---

## 🎯 Utilizare rapidă

1. **Alege tema** din dropdown (recomand "Automat" pentru început)
2. **Setează dispoziția** (neutră, fericit, calm, energetic)
3. **Configurează vremea** (sau lasă pe "Detectare automată")
4. **Ajustează ora** pentru a vedea schimbările de culori
5. **Apasă "Generează Wallpaper"**
6. **Descarcă** wallpaper-ul generat

---

## 🔧 Configurare avansată

### Integrare cu API vreme real
1. Obține un API key de la [OpenWeatherMap](https://openweathermap.org/api)
2. Editează `weather-integration.js`
3. Înlocuiește `YOUR_API_KEY_HERE` cu cheia ta
4. Integrează în `server.js`

### Personalizare culori
Editează `config.js` pentru a modifica:
- Schema de culori bazată pe timp
- Teme personalizate
- Efecte vizuale

---

## 🐳 Cu Docker

```bash
# Construiește și rulează
docker-compose up --build

# Sau cu Docker direct
docker build -t smart-wallpaper .
docker run -p 3000:3000 smart-wallpaper
```

---

## 🧪 Testare

```bash
# Rulează testele
npm test

# Sau direct
node test.js
```

---

## 📱 Caracteristici cheie

- ✅ **Adaptare automată la timp** - culorile se schimbă cu ora
- ✅ **Teme personalizabile** - 6 teme predefinite
- ✅ **Elemente meteo** - iconițe și culori adaptate
- ✅ **Dispoziție personală** - elemente vizuale adaptate
- ✅ **Optimizat telefon** - rezoluție 1080x1920
- ✅ **Interfață modernă** - design responsive
- ✅ **Generare automată** - wallpaper nou în fiecare oră

---

## 🆘 Probleme comune

### "Canvas is not defined"
- Asigură-te că ai Node.js 14+
- Rulează `npm install` din nou

### "Port already in use"
- Schimbă portul în `config.js`
- Sau oprește alte aplicații de pe portul 3000

### "Cannot find module"
- Șterge `node_modules/` și rulează `npm install`

---

## 🌟 Sfaturi de utilizare

1. **Pentru wallpaper-uri de dimineață**: Alege ora 7-9 AM
2. **Pentru seara**: Alege ora 18-20 PM
3. **Pentru noapte**: Alege ora 22-6 AM
4. **Tema automat** se adaptează cel mai bine la timp
5. **Descarcă** wallpaper-urile înainte de a genera altele noi

---

## 📞 Suport

- 📖 [Documentație completă](README.md)
- 🧪 [Teste](test.js)
- 🌤️ [Integrare vreme](weather-integration.js)
- ⚙️ [Configurare](config.js)

---

**🎉 Aplicația ta de wallpaper inteligent este gata!**