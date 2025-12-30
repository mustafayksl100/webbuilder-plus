# WebCraft Studio - Web Site Builder

🚀 **Canlı Demo:** [https://webbuilderplus.vercel.app](https://webbuilderplus.vercel.app)

Modern, kullanıcı dostu bir web sitesi oluşturucu. Drag & drop arayüzü ile profesyonel web siteleri oluşturun.

## 🎯 Özellikler

- ✅ Sürükle-bırak bileşen sistemi
- ✅ 50+ hazır bileşen (Hero, Features, Pricing, Contact vb.)
- ✅ Responsive tasarım desteği
- ✅ Proje kaydetme ve yönetimi
- ✅ Kredi bazlı export sistemi
- ✅ Kullanıcı kimlik doğrulama
- ✅ Modern Neo-Brutalist UI tasarımı

## 🛠️ Teknolojiler

**Frontend:**
- React 18 + Vite
- Zustand (State Management)
- React Router DOM
- Lucide React (Icons)
- React Hot Toast

**Backend:**
- Node.js + Express
- PostgreSQL
- JWT Authentication
- bcryptjs

**Deployment:**
- Frontend: Vercel
- Backend: Render.com
- Database: Render PostgreSQL

---

## 🚀 Hızlı Başlangıç

### Seçenek 1: Docker ile Kurulum (Önerilen)

```bash
# Projeyi klonla
git clone https://github.com/mustafayksl100/webbuilder-plus.git
cd webbuilder-plus

# Docker ile başlat
docker-compose up --build

# Erişim:
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
# Database: localhost:5432
```

### Seçenek 2: Manuel Kurulum

#### 1. Gereksinimler
- Node.js 18+
- PostgreSQL 14+
- npm veya yarn

#### 2. Veritabanı Kurulumu
```bash
# PostgreSQL'de veritabanı oluştur
createdb webcraft_studio

# Schema'yı yükle
psql -d webcraft_studio -f database/schema.sql
```

#### 3. Backend Kurulumu
```bash
cd backend

# .env dosyası oluştur
cp .env.example .env

# .env dosyasını düzenle (DATABASE_URL'i ayarla)
# DATABASE_URL=postgresql://postgres:password@localhost:5432/webcraft_studio

# Bağımlılıkları yükle
npm install

# Sunucuyu başlat
npm start
```

#### 4. Frontend Kurulumu
```bash
cd frontend

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

---

## 👤 Demo Hesabı

```
Email:    mustafa@gmail.com
Şifre:    mustafa159
Krediler: 1000
```

---

## 📁 Proje Yapısı

```
webcraft-studio/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # UI bileşenleri
│   │   ├── pages/          # Sayfa bileşenleri
│   │   ├── store/          # Zustand store'ları
│   │   └── services/       # API servisleri
│   └── package.json
│
├── backend/                # Express backend
│   ├── routes/             # API route'ları
│   ├── middleware/         # Auth middleware
│   ├── config/             # Veritabanı config
│   ├── database/           # Schema dosyaları
│   └── package.json
│
├── database/               # SQL schema
│   └── schema.sql
│
├── docker-compose.yml      # Docker yapılandırması
└── README.md
```

---

## 🔧 API Endpoints

### Auth
- `POST /api/auth/register` - Kayıt ol
- `POST /api/auth/login` - Giriş yap
- `GET /api/auth/me` - Kullanıcı bilgisi

### Projects
- `GET /api/projects` - Projeleri listele
- `POST /api/projects` - Yeni proje oluştur
- `PUT /api/projects/:id` - Proje güncelle
- `DELETE /api/projects/:id` - Proje sil

### Credits
- `GET /api/credits/packages` - Kredi paketleri
- `POST /api/credits/purchase` - Kredi satın al

---

## 🌐 Canlı Demo

- **Frontend:** https://webbuilderplus.vercel.app
- **Backend API:** https://webbuilder-plus.onrender.com
- **API Docs:** https://webbuilder-plus.onrender.com/api/docs

---

## 📝 Lisans

MIT License

## 👨‍💻 Geliştirici

Mustafa Yüksel - 2024
