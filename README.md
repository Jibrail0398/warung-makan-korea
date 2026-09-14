# Warung Makan Korea

Aplikasi website untuk usaha Warung Makan Korea.

---

## Struktur Project

```
warung-makan-korea/
├── frontend/    # Vue.js 3 + Vite
├── backend/     # Laravel 13 + PostgreSQL
└── storage/     # File storage
```

---

## Prerequisites

| Tool      | Version        |
|-----------|----------------|
| Node.js   | ^22.18.0 atau >=24.12.0 |
| npm       | latest         |
| Docker    | latest         |
| Docker Compose | latest    |

---

## Frontend (Vue.js 3 + Vite)

### Setup

```bash
cd frontend
npm install
```

### Jalankan Development Server

```bash
npm run dev
```

Aplikasi frontend akan berjalan di http://localhost:5173

### Build untuk Production

```bash
npm run build
```

### Preview Build Production

```bash
npm run preview
```

---

## Backend (Laravel 13 via Docker)

Backend menggunakan **Laravel Sail** untuk menjalankan aplikasi melalui Docker.

### 1. Buat File .env

```bash
cd backend
cp .env.example .env
```

### 2. Build dan Jalankan Container

```bash
./vendor/bin/sail up -d
```

### 3. Generate Application Key

```bash
./vendor/bin/sail artisan key:generate
```

Container yang akan berjalan:
| Service        | Port  | Keterangan                    |
|----------------|-------|-------------------------------|
| laravel.test   | 8000  | Aplikasi Laravel              |
| pgsql          | 5433  | PostgreSQL Database           |
| redis          | 6380  | Redis Cache                   |
| mailpit        | 8026  | Mail Testing Dashboard        |

### 4. Jalankan Migrasi Database

```bash
./vendor/bin/sail artisan migrate
```

### 5. Jalankan Database Seeder (opsional)

```bash
./vendor/bin/sail artisan db:seed
```

### 6. Aplikasi Backend

Aplikasi Laravel akan berjalan di http://localhost:8000

---

## Perintah Umum Backend (via Docker)

### Menjalankan artisan command

```bash
./vendor/bin/sail artisan <command>
```

Contoh:
```bash
# Jalankan migration
./vendor/bin/sail artisan migrate

# Buat migration baru
./vendor/bin/sail artisan make:migration create_users_table

# Buat model baru
./vendor/bin/sail artisan make:model User

# Buat controller baru
./vendor/bin/sail artisan make:controller UserController

# Clear cache
./vendor/bin/sail artisan cache:clear
./vendor/bin/sail artisan config:clear
./vendor/bin/sail artisan route:clear
```

### Menjalankan PHP CLI

```bash
./vendor/bin/sail php <command>
```

### Menjalankan npm di dalam container backend

```bash
./vendor/bin/sail npm install
./vendor/bin/sail npm run build
```

### Akses bash shell di dalam container

```bash
./vendor/bin/sail bash
```

### Lihat log container

```bash
./vendor/bin/sail logs
./vendor/bin/sail logs -f
```

### Stop / Hapus Container

```bash
# Stop container
./vendor/bin/sail down

# Stop container dan hapus volumes
./vendor/bin/sail down -v
```

---

## Perintah Lengkap dari Awal (Fresh Setup)

### Backend

```bash
cd backend
cp .env.example .env
./vendor/bin/sail up -d
./vendor/bin/sail artisan key:generate
./vendor/bin/sail artisan migrate
./vendor/bin/sail artisan db:seed
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## API Endpoints

Backend menyediakan REST API. Frontend terhubung ke backend melalui API endpoint yang tersedia di http://localhost:8000.

---

## License

MIT
