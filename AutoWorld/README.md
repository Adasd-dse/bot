# AutoWorld - Ecosistem Auto Complet

## 🚗 Descriere

AutoWorld este o aplicație mobilă profesională care oferă un ecosistem complet pentru pasionații de mașini. Aplicația integrează comunități, marketplace, evenimente, asistență rutieră și multe alte funcționalități într-o singură platformă.

**Slogan:** "Totul despre mașini, într-un singur loc."

## ✨ Funcționalități Principale

### 🏠 **Home Screen**
- Feed personalizat cu conținut relevant
- Acces rapid la funcții principale
- Articole recomandate
- Evenimente apropiate
- Comunități recomandate

### 👥 **Comunități**
- Grupuri tematice (tuning, motorsport, classic, off-road, electric, drifting)
- Grupuri publice și private
- Forum integrat cu discuții structurate
- Evenimente private organizate de comunități
- Profil membru cu mașini și proiecte

### 🗺️ **Hartă Inteligentă**
- Centrul nervos al aplicației
- Evenimente în timp real
- Comunități și grupuri locale
- Marketplace geolocalizat
- AutoHelp integrat
- Spotting și fotografie auto
- Rute recomandate

### 🛒 **Marketplace**
- Vânzare și cumpărare de piese, accesorii, anvelope, uleiuri
- Filtrare avansată după marcă, model, an, compatibilitate
- Profil vânzător cu recenzii și rating
- Sisteme de plată integrate
- Listare rapidă pentru magazine partenere

### 📅 **Evenimente Auto**
- Calendar cu evenimente relevante
- Track days, drift, retro parade, expoziții, concursuri
- Filtrare după tip, dată și locație
- Hărți interactive cu indicații GPS
- Înscriere și plată directă în aplicație

### 🆘 **AutoHelp**
- Sistem de ajutor rapid între șoferi
- Tipuri de probleme: pană, baterie, combustibil, tractare
- Harta comunității disponibile pentru ajutor
- Integrare cu service-uri profesioniste
- Gamificare cu puncte și badge-uri

### 💬 **Messenger**
- Chat direct între utilizatori
- Grupuri de chat pentru comunități
- Mesaje vocale și video
- Integrare cu notificări push

### 📰 **Blog & Știri**
- Articole oficiale despre noutăți auto
- Tutoriale și ghiduri tehnice
- Bloguri create de utilizatori
- Sistem de comentarii și rating

### 🏢 **Uniuni & Cluburi**
- Liste de cluburi și uniuni oficiale
- Pagini oficiale cu profil și membri
- Calendar evenimente
- Notificări pentru înscrieri

### 👤 **Profil Utilizator**
- Profil complet cu informații personale
- Garaj virtual cu mașini și proiecte
- Istoric evenimente și participări
- Badge-uri și puncte de gamificare
- Feed personalizat

## 🛠️ Tehnologii Utilizate

- **Framework:** React Native cu Expo
- **Limbaj:** TypeScript
- **Navigație:** React Navigation
- **Hărți:** React Native Maps
- **Iconuri:** Expo Vector Icons
- **Locație:** Expo Location
- **Notificări:** Expo Notifications

## 📱 Compatibilitate

- ✅ **Android** - Versiunea minimă: Android 6.0 (API level 23)
- ✅ **iOS** - Versiunea minimă: iOS 12.0
- 📱 **Tablete** - Suport complet pentru iPad și Android tablets

## 🚀 Instalare și Rulare

### Cerințe Preliminare
- Node.js (versiunea 16 sau mai nouă)
- npm sau yarn
- Expo CLI
- Android Studio (pentru dezvoltarea Android)
- Xcode (pentru dezvoltarea iOS, doar pe macOS)

### Pași de Instalare

1. **Clonează repository-ul**
   ```bash
   git clone <repository-url>
   cd AutoWorld
   ```

2. **Instalează dependențele**
   ```bash
   npm install
   ```

3. **Pornește aplicația**
   ```bash
   # Pentru Android
   npm run android
   
   # Pentru iOS
   npm run ios
   
   # Pentru web
   npm run web
   ```

4. **Folosește Expo Go** (pentru testare rapidă)
   ```bash
   npm start
   ```
   Apoi scanează QR code-ul cu aplicația Expo Go pe telefonul tău.

## 📁 Structura Proiectului

```
AutoWorld/
├── src/
│   ├── components/          # Componente reutilizabile
│   │   └── common/         # Componente comune (Button, Card, Header)
│   ├── screens/            # Ecranele aplicației
│   ├── navigation/         # Configurația de navigație
│   ├── types/              # Tipuri TypeScript
│   ├── constants/          # Constante (culori, dimensiuni, config)
│   ├── services/           # Servicii API și logica de business
│   └── utils/              # Funcții utilitare
├── assets/                 # Imagini, fonturi și alte resurse
├── App.tsx                 # Componenta principală
├── app.json               # Configurația Expo
└── package.json           # Dependențe și scripturi
```

## 🎨 Design și UI/UX

### Paleta de Culori
- **Primary:** Albastru închis (#1E3A8A)
- **Secondary:** Auriu (#F59E0B)
- **Accent:** Roșu (#EF4444)
- **Success:** Verde (#10B981)
- **Warning:** Portocaliu (#F59E0B)
- **Error:** Roșu (#EF4444)

### Principii de Design
- **Mobile-first:** Interfața optimizată pentru mobile
- **Consistență:** Design uniform în toată aplicația
- **Accesibilitate:** Suport pentru utilizatori cu dizabilități
- **Performanță:** Răspuns rapid și animații fluide

## 🔧 Configurare

### Variabile de Mediu
Creează un fișier `.env` în rădăcina proiectului:

```env
# API Configuration
API_BASE_URL=https://api.autoworld.com
API_TIMEOUT=30000

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Firebase (pentru notificări)
FIREBASE_CONFIG=your_firebase_config

# Analytics
ANALYTICS_KEY=your_analytics_key
```

### Configurarea Hărții
În `src/constants/index.ts` poți modifica:
- Locația implicită (București)
- Nivelul de zoom implicit
- Configurările pentru clustere

## 📊 Funcționalități Avansate

### 🎯 Gamificare
- Sistem de puncte pentru activități
- Badge-uri cu diferite rarități
- Leaderboards pentru comunități
- Puncte convertibile în reduceri

### 🔔 Notificări Inteligente
- Notificări personalizate
- Reminder-uri pentru evenimente
- Alertă pentru oferte speciale
- Notificări de comunitate

### 🔍 Căutare Avansată
- Filtrare multi-criterii
- Căutare geolocalizată
- Istoric căutări
- Sugestii inteligente

## 🚀 Deployment

### Android
1. Configurează `app.json` cu informațiile aplicației
2. Generează un keystore pentru semnarea APK-ului
3. Rulează `expo build:android`

### iOS
1. Configurează `app.json` cu informațiile aplicației
2. Generează certificatul de dezvoltare
3. Rulează `expo build:ios`

## 🤝 Contribuții

1. Fork repository-ul
2. Creează o branch pentru feature (`git checkout -b feature/AmazingFeature`)
3. Commit schimbările (`git commit -m 'Add some AmazingFeature'`)
4. Push la branch (`git push origin feature/AmazingFeature`)
5. Deschide un Pull Request

## 📝 Licență

Acest proiect este licențiat sub licența MIT - vezi fișierul [LICENSE](LICENSE) pentru detalii.

## 📞 Contact

- **Email:** contact@autoworld.com
- **Website:** https://autoworld.com
- **Support:** support@autoworld.com

## 🙏 Mulțumiri

- Expo pentru framework-ul extraordinar
- React Native pentru performanța nativă
- Comunitatea open source pentru librăriile folosite

---

**AutoWorld** - Totul despre mașini, într-un singur loc! 🚗✨