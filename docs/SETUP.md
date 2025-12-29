# WebCraft Studio - Kurulum ve Deployment Rehberi

## Gereksinimler

- Node.js v18+
- PostgreSQL 14+
- npm veya yarn

## Kurulum

### 1. Projeyi İndirin

```bash
git clone <repository-url>
cd webcraft-studio
```

### 2. Backend Kurulumu

```bash
cd backend

# Bağımlılıkları yükleyin
npm install

# Environment dosyasını oluşturun
cp .env.example .env

# .env dosyasını düzenleyin (veritabanı bilgileri vb.)
```

### 3. Veritabanı Kurulumu

```bash
# PostgreSQL'de veritabanı oluşturun
psql -U postgres
CREATE DATABASE webcraft_studio;
\q

# Schema'yı uygulayın
psql -U postgres -d webcraft_studio -f ../database/schema.sql
```

### 4. Frontend Kurulumu

```bash
cd ../frontend

# Bağımlılıkları yükleyin
npm install
```

## Çalıştırma

### Development

```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Production Build

```bash
# Frontend build
cd frontend
npm run build

# Backend - production mode
cd ../backend
NODE_ENV=production npm start
```

## Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/webcraft_studio

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# CORS
FRONTEND_URL=http://localhost:5173

# Credits
EXPORT_CREDIT_COST=200
INITIAL_USER_CREDITS=500
```

## Proje Yapısı

```
webcraft-studio/
├── backend/
│   ├── config/          # Veritabanı konfigürasyonu
│   ├── middleware/      # Auth middleware
│   ├── routes/          # API endpoint'leri
│   ├── services/        # İş mantığı servisleri
│   └── server.js        # Ana sunucu dosyası
├── frontend/
│   ├── src/
│   │   ├── components/  # React bileşenleri
│   │   ├── pages/       # Sayfa bileşenleri
│   │   ├── store/       # Zustand state yönetimi
│   │   └── services/    # API servisleri
│   └── index.html
├── database/
│   └── schema.sql       # PostgreSQL şeması
└── docs/
    ├── SETUP.md         # Bu dosya
    └── API.md           # API dokümantasyonu
```

## Önemli Notlar

1. **JWT Secret**: Production'da güçlü bir secret kullanın
2. **Database**: Connection string'i doğru ayarlayın
3. **CORS**: Frontend URL'ini doğru belirtin
4. **Uploads**: Upload klasörü için yazma izni gerekli

## Demo Kullanıcı

Kayıt olduktan sonra otomatik olarak 500 kredi eklenir.

## Sorun Giderme

### Port Çakışması
```bash
# Port 5000 veya 5173 kullanımdaysa
# .env'de PORT değerini değiştirin
# vite.config.js'de server.port'u değiştirin
```

### Veritabanı Bağlantı Hatası
- PostgreSQL servisinin çalıştığından emin olun
- Connection string'i kontrol edin
- Veritabanının oluşturulduğundan emin olun

### CORS Hatası
- .env'deki FRONTEND_URL'i kontrol edin
- Backend'in doğru port'ta çalıştığını kontrol edin
