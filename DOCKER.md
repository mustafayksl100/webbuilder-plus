# WebCraft Studio - Docker Deployment

## Hızlı Başlangıç

### Gereksinimler
- Docker ve Docker Compose yüklü olmalı

### Docker ile Çalıştırma

1. **Ortam değişkenlerini ayarlayın:**
   ```bash
   cp .env.example .env
   # .env dosyasını düzenleyin ve güvenli değerler ayarlayın
   ```

2. **Container'ları başlatın:**
   ```bash
   docker-compose up -d
   ```

3. **Uygulamaya erişin:**
   - Frontend: http://localhost
   - Backend API: http://localhost/api

### Docker Komutları

```bash
# Tüm servisleri başlat
docker-compose up -d

# Logları izle
docker-compose logs -f

# Servisleri durdur
docker-compose down

# Servisleri yeniden build et
docker-compose up -d --build

# Veritabanı dahil tüm verileri temizle
docker-compose down -v
```

## Servisler

| Servis | Port | Açıklama |
|--------|------|----------|
| frontend | 80 | Nginx + React SPA |
| backend | 5000 (internal) | Express.js API |
| postgres | 5432 | PostgreSQL veritabanı |

## Ortam Değişkenleri

`docker-compose.yml` dosyasında veya `.env` dosyasında ayarlayın:

- `DB_PASSWORD`: PostgreSQL şifresi
- `JWT_SECRET`: JWT token için gizli anahtar
- `FRONTEND_URL`: Frontend URL (CORS için)

## Production Deployment

Production ortamı için:

1. Güçlü şifreler ve gizli anahtarlar kullanın
2. SSL/TLS sertifikası ekleyin
3. `docker-compose.prod.yml` oluşturun
