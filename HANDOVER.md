# Proje Teslim ve Kurulum Rehberi

Bu belge, **WebCraft Studio** projesini staj yerine veya başka bir geliştiriciye teslim etmek için gerekli adımları içerir.

## 1. Proje Dosyalarının Paketlenmesi

Projeyi teslim etmenin en temiz yolu GitHub deposunu paylaşmaktır. Ancak dosyaları manuel olarak iletmeniz gerekirse:

1.  Aşağıdaki dosyaları ve klasörleri **SİLMEYİN**, bunlar gereklidir:
    *   `frontend/` (React kodları)
    *   `backend/` (Node.js kodları)
    *   `database/schema.sql` (Veritabanı yapısı)
    *   `docker-compose.yml` (Opsiyonel docker kurulumu için)
    *   `README.md`

2.  Aşağıdaki klasörleri **SİLİN** (Boyutu çok büyütür ve yeni kurulumda tekrar oluşturulur):
    *   `frontend/node_modules`
    *   `backend/node_modules`
    *   `frontend/dist` (Build dosyaları)
    *   `.git` (Eğer git geçmişini paylaşmak istemiyorsanız)

Geriye kalan klasörü `.zip` veya `.rar` yaparak "WebBuilder_Project_Mustafa" gibi bir isimle teslim edebilirsiniz.

---

## 2. Veritabanının Teslim Edilmesi

Veritabanını iki şekilde teslim edebilirsiniz:

### Seçenek A: Sadece Yapıyı Teslim Etmek (Temiz Başlangıç)
*   **Dosya:** `database/schema.sql`
*   **Ne işe yarar:** Projeyi alan kişi bu dosyayı çalıştırdığında boş, temiz bir veritabanı oluşur. Kullanıcılar ve projeler sıfırdan başlar.
*   **Nasıl kullanılır:** Alıcı, README dosyasındaki kurulum adımlarını takip eder.

### Seçenek B: Mevcut Verilerle Teslim Etmek (Kendi Projeleriniz Dahil)
Eğer kendi bilgisayarınızda oluşturduğunuz projeleri ve kullanıcıları da göstermek istiyorsanız, mevcut veritabanınızın yedeğini almalısınız.

**Yedek Alma Komutu (Terminalde çalıştırın):**
```bash
pg_dump -U postgres -d webcraft_studio > full_backup.sql
```
*Bu komut `full_backup.sql` adında bir dosya oluşturur. Bu dosyayı proje klasörüne ekleyip teslim edebilirsiniz.*

---

## 3. Kurulum Talimatları (Alıcı İçin)

Projenizi teslim alan kişinin yapması gerekenler:

### Gereksinimler
*   Node.js (v18 veya üzeri)
*   PostgreSQL

### Adım Adım Kurulum

1.  **Veritabanını Oluşturun:**
    PostgreSQL'de `webcraft_studio` adında boş bir veritabanı oluşturun.

2.  **Veritabanını Yükleyin:**
    *   *Temiz kurulum için:* `database/schema.sql` dosyasını içe aktarın.
    *   *Dolu kurulum için:* `full_backup.sql` dosyasını içe aktarın.

3.  **Backend Kurulumu:**
    ```bash
    cd backend
    npm install
    
    # .env dosyasını oluşturun (.env.example'dan kopyalayın) ve veritabanı şifrenizi girin
    cp .env.example .env
    
    npm start
    ```

4.  **Frontend Kurulumu:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

---

## 4. Önemli Notlar

*   **Gizlilik:** `.env` dosyanızı **ASLA** paylaşmayın. İçinde veritabanı şifreleriniz olabilir. Alıcı kendi `.env` dosyasını oluşturmalıdır (örnek dosya `.env.example` bunun içindir).
*   **Demo Hesabı:** Eğer veri tabanını `schema.sql` ile kurarlarsa, varsayılan giriş bilgileri şöyledir:
    *   **Email:** `mustafa@gmail.com`
    *   **Şifre:** `mustafa159`

---

## 5. Teslim Kontrol Listesi ✅

*   [ ] Proje dosyaları ziplendi (node_modules hariç).
*   [ ] `database/schema.sql` dosyasının güncel olduğu kontrol edildi.
*   [ ] (Opsiyonel) `full_backup.sql` oluşturuldu.
*   [ ] `.env` dosyası silindi (sadece .env.example kaldı).
*   [ ] Bu `HANDOVER.md` dosyası projeye eklendi.

Başarılar dilerim! 🚀
Mustafa Yüksel
