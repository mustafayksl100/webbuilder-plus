# WebCraft Studio - API Dokümantasyonu

## Base URL

```
http://localhost:5000/api
```

## Authentication

Tüm korumalı endpoint'ler için Authorization header gereklidir:

```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST /auth/register
Yeni kullanıcı kaydı.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Kayıt başarılı",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "credits": 500
    },
    "token": "jwt_token"
  }
}
```

### POST /auth/login
Kullanıcı girişi.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### GET /auth/me (Protected)
Mevcut kullanıcı bilgileri.

### PUT /auth/profile (Protected)
Profil güncelleme.

### PUT /auth/password (Protected)
Şifre değiştirme.

---

## Projects Endpoints

### GET /projects (Protected)
Kullanıcının projelerini listeler.

**Query Parameters:**
- `status`: draft | published | archived
- `search`: Arama terimi
- `page`: Sayfa numarası
- `limit`: Sayfa başı kayıt

### GET /projects/:id (Protected)
Tek proje detayı.

### POST /projects (Protected)
Yeni proje oluşturma.

**Request:**
```json
{
  "name": "Proje Adı",
  "description": "Açıklama",
  "templateId": "uuid",
  "cssFramework": "tailwind"
}
```

### PUT /projects/:id (Protected)
Proje güncelleme.

**Request:**
```json
{
  "name": "Yeni Ad",
  "content": { "components": [] },
  "settings": {},
  "status": "draft"
}
```

### DELETE /projects/:id (Protected)
Proje silme.

### POST /projects/:id/duplicate (Protected)
Proje kopyalama.

### POST /projects/:id/save-version (Protected)
Versiyon kaydetme.

### GET /projects/:id/versions (Protected)
Versiyon geçmişi.

### POST /projects/:id/restore/:version (Protected)
Versiyonu geri yükleme.

---

## Templates Endpoints

### GET /templates
Tüm şablonları listeler.

**Query Parameters:**
- `type`: header | footer | theme | page
- `category`: business | portfolio | ecommerce | blog
- `framework`: tailwind | bootstrap | vanilla

### GET /templates/headers
Header şablonları.

### GET /templates/themes
Tema şablonları.

### GET /templates/:id
Tek şablon detayı.

### GET /templates/components/all
Tüm bileşenler.

### GET /templates/config/fonts
Kullanılabilir fontlar.

### GET /templates/config/color-palettes
Renk paletleri.

---

## Credits Endpoints

### GET /credits/balance (Protected)
Kredi bakiyesi.

**Response:**
```json
{
  "success": true,
  "data": {
    "credits": 500,
    "exportCost": 200
  }
}
```

### GET /credits/packages
Kredi paketleri.

### GET /credits/history (Protected)
İşlem geçmişi.

### POST /credits/purchase (Protected)
Kredi satın alma (simülasyon).

**Request:**
```json
{
  "packageId": "uuid",
  "paymentMethod": "credit_card",
  "cardDetails": {
    "number": "4111111111111111",
    "name": "JOHN DOE",
    "expiry": "12/25",
    "cvv": "123"
  }
}
```

---

## Export Endpoints

### POST /export/:projectId (Protected)
Proje export etme (200 kredi gerekli).

**Request:**
```json
{
  "framework": "tailwind"
}
```

**Response:** ZIP dosyası (application/zip)

### GET /export/preview/:projectId (Protected)
Oluşturulan kodu önizleme.

**Response:**
```json
{
  "success": true,
  "data": {
    "html": "<!DOCTYPE html>...",
    "css": "/* styles */...",
    "js": "// scripts...",
    "framework": "tailwind"
  }
}
```

### GET /export/history (Protected)
Export geçmişi.

---

## Error Responses

```json
{
  "success": false,
  "message": "Hata mesajı"
}
```

**HTTP Status Codes:**
- 200: Başarılı
- 201: Oluşturuldu
- 400: Geçersiz istek
- 401: Yetkisiz
- 403: Erişim engellendi
- 404: Bulunamadı
- 500: Sunucu hatası

---

## Rate Limiting

- 100 istek / 15 dakika per IP
- Aşıldığında 429 Too Many Requests döner
