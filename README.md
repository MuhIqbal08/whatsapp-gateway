# WhatsApp Gateway API

WhatsApp Gateway API adalah aplikasi backend & dashboard web untuk mengelola pengiriman pesan WhatsApp secara terpusat, termasuk pesan personal dan grup, dengan dukungan multi device serta monitoring melalui dashboard.

> **Status Project: DEVELOPMENT (BELUM SELESAI)**  
> Project ini masih dalam tahap pengembangan aktif.  
> Beberapa fitur belum final, dapat berubah sewaktu-waktu, dan **belum direkomendasikan untuk production**.

---

## Fitur yang Tersedia

### Backend
- Multi device WhatsApp
- Kirim pesan WhatsApp:
  - 1 nomor
  - Banyak nomor (bulk send)
  - Group WhatsApp
- Delay / rate-limit untuk menghindari spam
- Logging status pesan:
  - Pending
  - Success
  - Failed
- Manajemen user & role
- Endpoint data untuk dashboard (admin & user)

### Frontend
- Dashboard Admin
- Dashboard User (UI diseragamkan dengan Admin)
- Monitoring status device WhatsApp
- Statistik pengiriman pesan
- Manajemen user (admin)

---

## Cara Menjalankan

**Backend**
```bash
cd backend
npm install
npm run dev

**Frontend**
```bash
cd frontend
npm install
npm run dev
