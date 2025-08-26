# Smart Wallpaper - Wallpaper Inteligent pentru Telefon

O aplicație web progresivă (PWA) care generează wallpaper-uri inteligente și dinamice pentru telefonul tău, adaptându-se automat în funcție de timp, vreme, dispoziție sau preferințe personale.

## 🌟 Caracteristici

- **🕐 Wallpaper bazat pe timp** - Se schimbă automat în funcție de momentul zilei (dimineață, zi, seară, noapte)
- **🌤️ Wallpaper bazat pe vreme** - Se adaptează la condițiile meteo curente din locația ta
- **😊 Wallpaper bazat pe dispoziție** - Generează imagini care reflectă diferite stări emoționale
- **🎨 Wallpaper abstract** - Creează modele abstracte unice de fiecare dată
- **📱 Instalabil pe telefon** - Funcționează ca o aplicație nativă prin tehnologia PWA
- **🔄 Schimbare automată** - Actualizare automată la intervale personalizabile
- **💾 Funcționare offline** - Odată instalată, funcționează și fără conexiune la internet
- **⬇️ Descărcare wallpaper** - Salvează wallpaper-urile generate direct pe telefon

## 📲 Instalare pe Telefon

### Android
1. Deschide aplicația în Chrome pe telefon
2. Apasă pe meniul cu 3 puncte (⋮) din colțul din dreapta sus
3. Selectează "Adaugă la ecranul de pornire" sau "Instalează aplicația"
4. Urmează instrucțiunile pentru instalare

### iOS
1. Deschide aplicația în Safari pe iPhone
2. Apasă pe butonul de partajare (↗️) 
3. Derulează în jos și selectează "Adaugă la ecranul de pornire"
4. Confirmă adăugarea aplicației

## 🚀 Utilizare

### Pornire Rapidă
1. Deschide fișierul `index.html` într-un browser modern
2. Aplicația va genera automat un wallpaper bazat pe ora curentă
3. Personalizează folosind controalele din partea dreaptă

### Moduri Disponibile
- **Bazat pe Timp**: Culori și elemente care se schimbă cu momentul zilei
- **Bazat pe Vreme**: Necesită permisiunea pentru locație pentru date meteo precise
- **Dispoziție**: Generează aleatoriu wallpaper-uri pentru diferite stări emoționale
- **Abstract**: Modele geometrice și particule aleatorii

### Personalizare
- Alege din 4 scheme de culori predefinite
- Activează/dezactivează schimbarea automată
- Setează intervalul de schimbare (1-24 ore)
- Afișează/ascunde ora și vremea pe wallpaper

## 🛠️ Dezvoltare

### Tehnologii Folosite
- HTML5 Canvas pentru generarea wallpaper-urilor
- CSS3 cu design responsive
- JavaScript vanilla (fără framework-uri)
- PWA cu Service Worker pentru funcționalitate offline
- API-uri Web moderne (Geolocation, LocalStorage)

### Structura Proiectului
```
/workspace/
├── index.html          # Pagina principală
├── styles.css          # Stiluri CSS
├── app.js             # Logica aplicației
├── manifest.json      # Manifest PWA
├── sw.js              # Service Worker
├── generate-icons.html # Generator de icoane
├── icons/             # Icoane aplicație
└── screenshots/       # Capturi de ecran
```

### API pentru Vreme
Pentru funcționalitatea meteo completă, înlocuiește `YOUR_API_KEY` din `app.js` cu o cheie API gratuită de la [OpenWeatherMap](https://openweathermap.org/api).

### Generare Icoane
1. Deschide `generate-icons.html` în browser
2. Iconițele vor fi descărcate automat
3. Mută-le în folderul `/icons/`

## 📝 Note

- Aplicația salvează preferințele local în browser
- Wallpaper-urile sunt generate dinamic folosind Canvas API
- Nu necesită server - poate rula local
- Optimizată pentru telefoane mobile

## 🤝 Contribuții

Simte-te liber să contribui la proiect prin:
- Adăugarea de noi moduri de wallpaper
- Îmbunătățirea algoritmilor de generare
- Adăugarea de noi scheme de culori
- Optimizări de performanță

## 📄 Licență

Acest proiect este open source și disponibil sub licența MIT.