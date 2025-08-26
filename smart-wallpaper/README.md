# 🎨 Wallpaper Inteligent pentru Telefon

O aplicație web care generează wallpaper-uri dinamice și inteligente pentru telefon, care se adaptează automat la timp, vreme și dispoziție.

## ✨ Caracteristici

- **Adaptare automată la timp**: Culorile se schimbă în funcție de ora zilei
- **Teme personalizabile**: Minimalist, geometric, natură, ocean, apus
- **Elemente meteo**: Iconițe și culori care reflectă vremea
- **Dispoziție personală**: Elemente vizuale adaptate la starea de spirit
- **Optimizat pentru telefon**: Rezoluție perfectă (1080x1920)
- **Interfață modernă**: Design responsive și intuitiv
- **Generare automată**: Wallpaper-uri noi în fiecare oră

## 🚀 Instalare

### Cerințe
- Node.js (versiunea 14 sau mai nouă)
- npm sau yarn

### Pași de instalare

1. **Clonează repository-ul**
   ```bash
   git clone <repository-url>
   cd smart-wallpaper
   ```

2. **Instalează dependențele**
   ```bash
   npm install
   ```

3. **Pornește aplicația**
   ```bash
   npm start
   ```

4. **Deschide în browser**
   Navighează la `http://localhost:3000`

## 🎯 Utilizare

### Generare Wallpaper

1. **Alege tema**: Selectează între teme predefinite sau lasă pe "Automat"
2. **Setează dispoziția**: Alege starea de spirit dorită
3. **Configurează vremea**: Selectează condițiile meteo
4. **Ajustează ora**: Modifică ora pentru a vedea cum se schimbă culorile
5. **Generează**: Apasă butonul "Generează Wallpaper"

### Descărcare

- După generare, apasă butonul "Descarcă Wallpaper"
- Fișierul se va salva automat în format PNG
- Numele fișierului include data curentă

### Scurtături tastatură

- **Ctrl + Enter**: Generare rapidă wallpaper

## 🎨 Teme disponibile

### Automat (bazat pe timp)
- **Dimineața (6-12)**: Culori calde, aurii
- **După-amiaza (12-18)**: Culori vibrante, turcoaz
- **Seara (18-22)**: Culori de apus, portocalii
- **Noaptea (22-6)**: Culori reci, albastre

### Teme predefinite
- **Minimalist**: Linii simple și elegante
- **Geometric**: Forme geometrice complexe
- **Natură**: Culori verzi, pădure
- **Ocean**: Culori albastre, marine
- **Apus**: Culori portocalii și roz

## 🌤️ Elemente meteo

- **Însorit**: Iconiță soare cu raze
- **Ploios**: Picături de ploaie
- **Înnorat**: Forme abstracte

## 📱 Compatibilitate

- **Rezoluție**: 1080x1920 (optimizat pentru telefoane)
- **Format**: PNG cu transparență
- **Browser**: Chrome, Firefox, Safari, Edge
- **Dispozitive**: Desktop, tabletă, telefon

## 🔧 Configurare avansată

### Modificare culori
Editează funcția `getColorScheme()` din `server.js` pentru a personaliza paleta de culori.

### Adăugare teme noi
Extinde funcția `addGeometricPatterns()` pentru a crea pattern-uri noi.

### Integrare API vreme
Modifică codul pentru a integra un API real de vreme (OpenWeatherMap, etc.).

## 🚀 Deployment

### Heroku
```bash
heroku create
git push heroku main
```

### Vercel
```bash
vercel --prod
```

### Docker
```bash
docker build -t smart-wallpaper .
docker run -p 3000:3000 smart-wallpaper
```

## 📝 Structura proiectului

```
smart-wallpaper/
├── public/
│   ├── index.html      # Interfața principală
│   ├── styles.css      # Stiluri CSS
│   └── script.js       # Logica frontend
├── server.js           # Server Node.js
├── package.json        # Dependențe și scripturi
└── README.md          # Documentație
```

## 🤝 Contribuții

Contribuțiile sunt binevenite! Te rugăm să:

1. Fork repository-ul
2. Creează un branch pentru feature (`git checkout -b feature/AmazingFeature`)
3. Commit schimbările (`git commit -m 'Add some AmazingFeature'`)
4. Push la branch (`git push origin feature/AmazingFeature`)
5. Deschide un Pull Request

## 📄 Licență

Acest proiect este licențiat sub MIT License - vezi fișierul [LICENSE](LICENSE) pentru detalii.

## 🙏 Mulțumiri

- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) pentru generarea graficelor
- [Express.js](https://expressjs.com/) pentru server
- [Moment.js](https://momentjs.com/) pentru manipularea datelor

## 📞 Suport

Pentru întrebări sau probleme:
- Deschide un issue pe GitHub
- Contactează dezvoltatorul

---

**Creat cu ❤️ pentru a face telefoanele tale mai frumoase și mai inteligente!**