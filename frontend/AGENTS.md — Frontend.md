# AGENTS.md — Frontend

## Project

Website restoran Indonesia di Korea dengan sistem ordering dan penjualan Raw Material.

Frontend menggunakan Vue dan harus dibuat sederhana, clean, modern, responsive, serta mudah di-maintain.

## Tech Stack

- Vue 3
- Vue Router
- Pinia
- Vue I18n
- CSS sederhana / sesuai kebutuhan project
- API backend melalui HTTP requests

Jangan menambahkan library besar jika kebutuhan dapat diselesaikan dengan fitur bawaan Vue atau library yang sudah digunakan.

---

# UI/UX

## Design

Gunakan desain:

- Clean
- Simple
- Modern
- Dominan putih
- Accent merah mengikuti warna logo
- Responsive desktop, tablet, dan mobile

Jangan membuat desain terlalu kompleks.

Gunakan aset logo dan foto produk yang diberikan client.

## Navigation

Navbar minimal memiliki:

- Logo
- Home
- Menu
- Raw Material
- Language
- Cart
- Login

---

# Product

Produk dibagi menjadi dua kelompok utama:

## Menu Makanan Restoran

Makanan siap makan.

## Raw Material

Bahan baku / bahan mentah yang dijual.

User harus dapat membedakan kedua kelompok tersebut dengan jelas melalui kategori/filter.

## Product Card

Product card menampilkan:

- Foto
- Nama produk
- Harga
- Berat / satuan

## Product Detail

Saat produk dipilih, tampilkan:

- Nama produk
- Foto
- Harga
- Berat / satuan
- Deskripsi / keterangan

---

# Authentication

Terdapat tiga jenis akses utama pada frontend:

## Guest

Guest tidak perlu register atau login.

Guest dapat:

- Melihat produk
- Memasukkan produk ke cart
- Checkout
- Mengisi Nama Lengkap
- Mengisi Nomor HP

Jangan membuat form guest yang panjang.

## Member

### Register

Member melakukan register menggunakan:

- Nomor HP Korea (+82)
- OTP melalui SMS/WhatsApp
- Password

### Login

Member login menggunakan:

- Nomor HP
- Password

Jangan mencampurkan form login Member dengan Admin/Kasir.

## Admin / Kasir

Login menggunakan:

- Username atau Email
- Password

Admin/Kasir dapat mengakses:

- Kelola produk
- Monitoring pesanan
- Laporan
- Reset password

## Super Admin

Super Admin hanya untuk internal developer.

Client tidak diberikan akses Super Admin.

Super Admin memiliki:

- Audit Log
- Activity Log

---

# Cart

Cart harus menyediakan:

- Daftar produk
- Foto produk
- Harga
- Quantity
- Subtotal
- Total

User dapat:

- Menambah quantity
- Mengurangi quantity
- Menghapus produk

Logic cart yang digunakan di beberapa halaman dapat dibuat sebagai composable/store reusable.

---

# Checkout

Checkout dapat digunakan oleh:

- Guest
- Member

Untuk Guest cukup:

- Nama Lengkap
- Nomor HP

Jangan menambahkan:

- Email
- TTL
- Form pribadi lainnya

kecuali memang dibutuhkan oleh backend.

---

# Payment

Gunakan:

**Transfer Bank Manual**

Tidak menggunakan payment gateway.

Flow:

1. User melakukan checkout.
2. Sistem menampilkan nomor rekening.
3. User melakukan transfer secara manual.
4. User mengupload screenshot bukti transfer.
5. User mengirim pesanan.

Frontend wajib menyediakan:

- Nomor rekening tujuan
- Form upload bukti transfer
- Preview bukti transfer
- Tombol submit/konfirmasi

Jangan membuat:

- Payment gateway
- Pembayaran otomatis
- Integrasi pengecekan mutasi rekening

---

# Order

User dapat melihat status pesanan.

Status mengikuti data dari backend.

Contoh:

- Menunggu pembayaran
- Menunggu verifikasi
- Diproses
- Selesai

Jangan membuat status baru tanpa kebutuhan backend.

---

# Admin / Kasir

Admin/Kasir memiliki dashboard sederhana.

## Monitoring Pesanan

Tampilkan:

- Nomor pesanan
- Nama customer
- Nomor HP
- Produk
- Total
- Bukti transfer
- Status
- Waktu pesanan

Kasir harus dapat melihat bukti transfer yang diupload customer.

## Notification

Pesanan baru harus memberikan notifikasi kepada kasir secara real-time.

Wajib terdapat:

- Visual notification
- Sound/audio alert berupa bunyi bel

Tujuannya agar kasir segera mengetahui adanya pesanan baru.

---

# Reports

Admin/Kasir dapat melihat:

## Harian

- Total transaksi
- Total pemasukan

## Bulanan

- Total transaksi
- Total pemasukan

Sediakan:

- Print struk pesanan
- Print rekap laporan

Gunakan browser print jika memungkinkan agar implementasi tetap sederhana.

---

# Multi-language

Gunakan **Vue I18n**.

Bahasa minimal:

- Indonesia
- Korea
- Inggris

Semua text UI harus menggunakan translation key.

Jangan melakukan hardcode text UI yang seharusnya diterjemahkan.

Contoh:

```text
src/locales/
├── id.json
├── ko.json
└── en.json
```

Gunakan `$t()` / fungsi translation Vue I18n pada component.

---

# Frontend Structure

Gunakan struktur sederhana:

```text
src/
├── assets/
├── components/
├── composables/
├── layouts/
├── pages/
├── stores/
├── services/
├── router/
├── locales/
├── i18n/
├── App.vue
├── main.js
└── style.css
```

## components/

Untuk UI/component yang reusable.

Contoh:

```text
Navbar.vue
Footer.vue
ProductCard.vue
ProductFilter.vue
ProductDetail.vue
CartItem.vue
ImageUpload.vue
OrderStatus.vue
NotificationAlert.vue
```

## composables/

Untuk reusable business/UI logic.

Contoh:

```text
useAuth.js
useCart.js
useProducts.js
useOrders.js
```

Jangan membuat composable jika logic hanya digunakan sekali dan tidak membutuhkan reuse.

## stores/

Gunakan Pinia untuk state global.

Contoh:

```text
auth.js
cart.js
order.js
```

## services/

Untuk komunikasi dengan backend/API.

Contoh:

```text
api.js
auth.js
products.js
orders.js
reports.js
```

Component tidak boleh berisi seluruh logic API request jika dapat dipisahkan ke service.

## pages/

Untuk halaman aplikasi.

```text
pages/
├── Home.vue
├── Menu.vue
├── RawMaterial.vue
├── ProductDetail.vue
├── Cart.vue
├── Checkout.vue
├── Login.vue
├── Register.vue
├── Order.vue
└── admin/
    ├── Dashboard.vue
    ├── Products.vue
    ├── Orders.vue
    └── Reports.vue
```

---

# Routing

Gunakan Vue Router.

Route harus dibatasi berdasarkan role.

Contoh:

- Guest → halaman publik dan checkout
- Member → halaman member
- Admin/Kasir → dashboard admin
- Super Admin → area internal

Jangan hanya menyembunyikan menu frontend sebagai metode keamanan. Hak akses sebenarnya tetap harus divalidasi oleh backend.

---

# Responsive

Semua halaman harus responsive.

Prioritaskan:

1. Mobile
2. Tablet
3. Desktop

Pastikan halaman berikut nyaman digunakan di mobile:

- Menu
- Product Detail
- Cart
- Checkout
- Upload bukti transfer

---

# Code Rules

1. Jangan menambahkan fitur yang tidak ada di requirement.
2. Jangan membuat payment gateway.
3. Jangan membuat checkout yang terlalu panjang.
4. Jangan mencampurkan login Member dan Admin/Kasir.
5. Jangan memberikan akses Super Admin kepada client.
6. Gunakan component reusable jika memang diperlukan.
7. Gunakan composable hanya untuk logic yang reusable.
8. Gunakan Pinia untuk state global.
9. Gunakan Vue I18n untuk multi-language.
10. Pisahkan API request dari UI component.
11. Jangan hardcode data produk jika data tersedia dari backend.
12. Jangan membuat library atau dependency baru tanpa alasan.
13. Jangan mengubah struktur project tanpa kebutuhan.
14. Jangan membuat UI yang terlalu kompleks.
15. Prioritaskan maintainability dan pengerjaan yang efisien.

---

# Important Rules for AI Agent

Sebelum membuat fitur baru:

1. Periksa requirement yang tersedia.
2. Periksa struktur project yang sudah ada.
3. Reuse component, composable, store, dan service yang sudah tersedia.
4. Jangan membuat file baru jika file yang sudah ada dapat digunakan.
5. Jangan mengubah API/backend contract tanpa alasan.
6. Jangan mengarang endpoint API.
7. Jika endpoint atau data backend belum tersedia, gunakan placeholder/mock seperlunya dan tandai dengan jelas.
8. Jangan mengimplementasikan fitur yang tidak diminta.
9. Pastikan perubahan tidak merusak fitur yang sudah ada.
10. Setelah perubahan, periksa responsive layout dan error pada console.

## Priority

Prioritas pengerjaan frontend:

1. Layout dan navigation
2. Menu makanan
3. Raw Material
4. Product Detail
5. Cart
6. Checkout
7. Transfer Bank Manual
8. Upload bukti transfer
9. Guest Order
10. Member Register + OTP
11. Member Login
12. Admin/Kasir Login
13. Admin Product Management
14. Order Monitoring
15. Real-time Notification + Sound Alert
16. Reports
17. Print
18. Multi-language
19. Responsive refinement

Implementasikan requirement yang diberikan secara sederhana, konsisten, dan mudah di-maintain.