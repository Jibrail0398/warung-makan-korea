# Warung Makan Korea - Backend API

Backend API untuk aplikasi Warung Makan Korea dengan Laravel dan PostgreSQL.

---

## Prerequisites

- Docker Desktop untuk Windows
- Git
- Git Bash atau WSL (Windows Subsystem for Linux)

---

## Instalasi

### 1. Install Docker Desktop untuk Windows

1. Download **Docker Desktop** dari https://www.docker.com/products/docker-desktop/
2. Jalankan installer, pastikan opsi **"Use WSL 2 instead of Hyper-V"** dicentang
3. Restart komputer setelah instalasi selesai
4. Buka Docker Desktop, pastikan statusnya **"Engine running"** (hijau di pojok kiri bawah)

> **Catatan:** Pastikan WSL 2 sudah aktif di Windows. Jika belum, buka PowerShell sebagai Admin lalu jalankan:
> ```powershell
> wsl --install
> ```
> Restart PC, lalu buka WSL untuk setup username/password saat pertama kali.

### 2. Clone Repository

Buka **Git Bash** atau **WSL Terminal**, lalu:

```bash
git clone <url-repo>
cd warung-makan-korea/backend
```

### 3. Setup Environment

```bash
cp .env.example .env
```

Edit file `.env`, pastikan database name sudah benar:

```
DB_DATABASE=warung_korea
```

### 4. Build dan Jalankan Container

```bash
./vendor/bin/sail up -d
```

> **Catatan Windows:** Jika muncul error permission, pastikan menjalankan command dari **Git Bash** atau **WSL**.

### 5. Generate Application Key

```bash
./vendor/bin/sail artisan key:generate
```

### 6. Jalankan Migrasi Database

```bash
./vendor/bin/sail artisan migrate
```

### 7. Generate dan Jalankan Seeder

**Jalankan semua seeder:**

```bash
./vendor/bin/sail artisan db:seed
```

**Jalankan seeder tertentu:**

```bash
./vendor/bin/sail artisan db:seed --class=CategorySeeder
./vendor/bin/sail artisan db:seed --class=ProductSeeder
```

**Fresh migrate + seed sekaligus:**

```bash
./vendor/bin/sail artisan migrate:fresh --seed
```

---

## Seeders

| Seeder | Fungsi |
|--------|--------|
| `DatabaseSeeder.php` | Seeder utama (runner) |
| `UserSeeder.php` | Data user/karyawan |
| `CategorySeeder.php` | Kategori produk |
| `ProductSeeder.php` | Data produk menu |
| `BankAccountSeeder.php` | Data rekening pembayaran |
| `OrderSeeder.php` | Data contoh pesanan |

---

## Akses Services

| Service | URL | Keterangan |
|---------|-----|------------|
| Laravel App | http://localhost:8000 | Backend API |
| PostgreSQL | localhost:5433 | Database (dari host) |
| Redis | localhost:6380 | Cache |
| Mailpit | http://localhost:8026 | Email testing dashboard |
| Adminer | http://localhost:8080 | Database GUI |

---

## Perintah Penting

```bash
# Lihat log container
./vendor/bin/sail logs -f

# Akses shell dalam container
./vendor/bin/sail bash

# Clear cache
./vendor/bin/sail artisan cache:clear

# Stop container
./vendor/bin/sail down

# Stop container dan hapus data volumes
./vendor/bin/sail down -v
```

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Error `Permission denied` | Gunakan Git Bash atau WSL, bukan CMD/PowerShell biasa |
| Port sudah digunakan | Ganti port di `.env`, contoh: `APP_PORT=8001` |
| Container gagal start | Cek log: `./vendor/bin/sail logs` atau cek Docker Desktop |
| Database connection refused | Pastikan container `pgsql` sudah running: `docker ps` |

---

## License

MIT
