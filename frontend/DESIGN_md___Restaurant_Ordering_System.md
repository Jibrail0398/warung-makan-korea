# Restaurant Ordering System — Frontend Design Specification

## 1. Project Overview

Website restoran dengan sistem ordering yang menyediakan dua kelompok produk:

1. **Menu Makanan Restoran** — makanan siap makan.
2. **Raw Material** — bahan baku/produk mentah yang dapat dibeli pelanggan.

Frontend harus mengutamakan:

- Clean
- Simple
- Modern
- Mobile-friendly
- Mudah digunakan oleh Guest maupun Member
- Mudah digunakan oleh Admin/Kasir
- Maintenance sederhana
- Tidak menggunakan animasi berlebihan
- Tidak menggunakan emoji pada UI, copywriting, maupun dokumentasi ini

---

# 2. Recommended Frontend Stack

## Core

- Vue 3
- Vite
- TypeScript
- Vue Router
- Pinia

## Styling

- Tailwind CSS

## UI Components

Gunakan komponen sederhana yang dibuat sendiri menggunakan Vue + Tailwind.

Hindari penggunaan UI framework besar apabila tidak diperlukan.

## Form & Validation

- Vue form handling
- Validasi client-side sederhana

## Icons

Gunakan icon library ringan seperti Lucide.

## API

Frontend berkomunikasi dengan backend menggunakan REST API.

Contoh:

```text
GET    /api/products
GET    /api/products/:id
POST   /api/orders
GET    /api/orders/:id
POST   /api/orders/:id/payment-proof
POST   /api/auth/register
POST   /api/auth/verify-otp
POST   /api/auth/login
```

---

# 3. Design Direction

## Visual Style

Karakter desain:

> Clean + Modern + Minimal + Restaurant

Gunakan banyak whitespace, card sederhana, typography yang jelas, dan foto makanan sebagai elemen visual utama.

Jangan membuat desain terlalu ramai.

## No Emoji Policy

Emoji tidak boleh digunakan di seluruh bagian frontend, termasuk:

- Label tombol dan menu
- Nama kategori produk
- Notifikasi dan toast
- Status order
- Halaman admin/kasir
- Dokumen desain ini

Gunakan alternatif berikut sebagai gantinya:

```text
Icon library (Lucide)
Warna (primary/success/warning/danger)
Teks status yang jelas
Badge/label sederhana
```

Tujuannya agar tampilan tetap profesional, konsisten lintas platform/OS, dan mudah di-maintain.

---

# 4. Color System

Warna utama mengikuti warna merah pada logo restoran.

Gunakan CSS variable agar warna mudah diganti apabila client memberikan kode warna logo yang sebenarnya.

```css
:root {
  --color-primary: #c62828;
  --color-primary-hover: #a61f1f;

  --color-background: #ffffff;
  --color-surface: #f8f8f8;

  --color-text: #171717;
  --color-text-secondary: #737373;

  --color-border: #e5e5e5;

  --color-success: #16a34a;
  --color-warning: #f59e0b;
  --color-danger: #dc2626;
}
```

### Penggunaan

**Primary Red**

Digunakan untuk:

- CTA utama
- Tombol checkout
- Harga/promosi tertentu
- Active category
- Status penting
- Notification indicator

**White**

Digunakan sebagai warna dominan.

**Light Gray**

Digunakan sebagai:

- Background section
- Card background tertentu
- Input background

Jangan menggunakan terlalu banyak warna.

---

# 5. Typography

Gunakan font modern dan mudah dibaca.

Recommended:

```text
Inter
```

Fallback:

```text
system-ui, sans-serif
```

Hierarchy:

```text
H1 — 32-40px
H2 — 24-30px
H3 — 18-22px
Body — 14-16px
Small — 12-14px
```

Mobile:

```text
H1 — 26-32px
H2 — 22-26px
H3 — 18-20px
Body — 14-16px
```

---

# 6. Responsive Design

Prioritas:

1. Mobile
2. Tablet
3. Desktop

Website harus nyaman digunakan dari HP karena customer kemungkinan besar melakukan ordering menggunakan smartphone.

Breakpoint:

```text
Mobile     < 640px
Tablet     640px - 1024px
Desktop    > 1024px
```

---

# 7. Public Website

## 7.1 Homepage

URL:

```text
/
```

Struktur:

```text
Header
Hero
Category Selection
Popular / Featured Products
Restaurant Menu
Raw Material
How to Order
Footer
```

### Header

Desktop:

```text
[LOGO]    Menu    Raw Material    About    [Login] [Cart]
```

Mobile:

```text
[Menu] [LOGO]                 [Cart]
```

Header harus sticky agar navigasi dan cart mudah diakses.

---

## 7.2 Hero Section

Tujuan:

- Memperkenalkan restoran
- Mengarahkan user ke menu
- Menampilkan visual makanan

Layout desktop:

```text
-----------------------------------------
|                                       |
|  Restaurant Name      [Food Image]    |
|  Short Description                    |
|                                       |
|  [Order Now]                          |
|                                       |
-----------------------------------------
```

Mobile:

```text
-------------------------
|       Food Image      |
|                       |
| Restaurant Name       |
| Description           |
|                       |
| [ Order Now ]         |
-------------------------
```

Hindari hero yang terlalu tinggi.

---

# 8. Product Category

Kategori utama wajib terlihat jelas.

```text
[ Semua ]
[ Menu Restoran ]
[ Raw Material ]
```

Active category menggunakan warna primary.

Contoh:

```text
Semua
Menu Restoran
Raw Material
```

Jika kategori produk semakin banyak, dapat menggunakan horizontal scrolling pada mobile.

---

# 9. Product Listing

Grid desktop:

```text
4 columns
```

Tablet:

```text
3 columns
```

Mobile:

```text
2 columns
```

Product Card:

```text
┌─────────────────────┐
│                     │
│     PRODUCT IMAGE   │
│                     │
├─────────────────────┤
│ Product Name        │
│ Description         │
│                     │
│ Rp xx.xxx           │
│                     │
│ [ + Add ]           │
└─────────────────────┘
```

Informasi minimum:

- Foto
- Nama produk
- Harga
- Satuan/berat
- Tombol tambah

---

# 10. Product Detail

Saat product card diklik, tampilkan halaman detail.

URL:

```text
/products/:id
```

Desktop:

```text
------------------------------------------
|                                        |
|       PRODUCT IMAGE | PRODUCT INFO     |
|                     |                  |
|                     | Product Name     |
|                     | Price            |
|                     | Weight / Unit    |
|                     | Description      |
|                     |                  |
|                     | Quantity [- 1 +] |
|                     | [ Add to Cart ]  |
|                                        |
------------------------------------------
```

Mobile:

```text
PRODUCT IMAGE

Product Name

Rp xx.xxx

Weight / Unit

Description

Quantity

[-] 1 [+]

[ Add to Cart ]
```

---

# 11. Cart

URL:

```text
/cart
```

Cart harus mudah diakses dari seluruh halaman.

Desktop:

```text
--------------------------------------------
| Cart                                     |
|                                          |
| Product      Qty       Price             |
| ---------------------------------------- |
| Product A    [- 1 +]   Rp xx.xxx         |
| Product B    [- 2 +]   Rp xx.xxx         |
|                                          |
| Subtotal                    Rp xxx.xxx    |
|                                          |
|              [ Checkout ]                 |
--------------------------------------------
```

Mobile:

Gunakan vertical card.

Jika cart kosong:

```text
Your cart is empty.

[ Browse Menu ]
```

---

# 12. Checkout

URL:

```text
/checkout
```

Checkout harus sesingkat mungkin.

## Guest Checkout

Guest hanya perlu:

```text
Nama Lengkap
Nomor HP
Catatan Pesanan (optional)
```

Jangan meminta:

- Email
- TTL
- Alamat lengkap apabila tidak diperlukan
- Data pribadi tambahan

---

## Member Checkout

Data member dapat otomatis diisi.

User cukup:

```text
Nomor HP
Catatan Pesanan
```

---

# 13. Phone Number

Sistem harus mendukung nomor HP Korea.

Format UI:

```text
+82
[ Phone Number ]
```

Jangan mengunci frontend hanya ke format Indonesia.

Frontend harus memberikan validasi dasar terhadap nomor HP.

OTP:

```text
Enter verification code

[ _ ] [ _ ] [ _ ] [ _ ] [ _ ] [ _ ]

Didn't receive code?
Resend OTP
```

---

# 14. Payment

Metode pembayaran:

```text
Bank Transfer
```

Tampilkan informasi rekening:

```text
Bank Name
Account Number
Account Holder
```

Setelah transfer:

```text
Upload Payment Proof

[ Choose Image ]

[ Submit Payment ]
```

Accepted:

```text
JPG
JPEG
PNG
WEBP
```

Berikan preview sebelum upload.

---

# 15. Order Success

Setelah order berhasil:

```text
Order Successfully Created

Order Number
#ORD-000123

Please complete your payment
and upload the payment proof.

[ View Order ]
```

Jika pembayaran belum diverifikasi:

```text
Payment Status
Waiting for Verification
```

---

# 16. Order Tracking

URL:

```text
/orders/:id
```

Status:

```text
Order Created
     ↓
Waiting Payment
     ↓
Payment Verification
     ↓
Preparing
     ↓
Ready
     ↓
Completed
```

Status harus divisualisasikan dengan sederhana.

Contoh:

```text
[Done] Order Created
[Done] Payment Received
[Active] Preparing
[Pending] Ready
[Pending] Completed
```

---

# 17. Authentication

## Login

```text
Phone Number
Password

[ Login ]

Forgot Password?

Don't have an account?
Register
```

---

## Register

Form minimal:

```text
Full Name
Phone Number
Password
Confirm Password

[ Register ]
```

Setelah register:

```text
OTP Verification
```

---

## Forgot Password

Flow:

```text
Phone Number
      ↓
OTP
      ↓
New Password
      ↓
Success
```

---

# 18. Admin / Cashier Dashboard

URL:

```text
/admin
```

Admin interface berbeda dari customer website.

Layout desktop:

```text
┌──────────────┬─────────────────────────────┐
│              │                             │
│ Dashboard    │                             │
│ Orders       │        MAIN CONTENT         │
│ Products     │                             │
│ Reports      │                             │
│ Settings     │                             │
│              │                             │
│ Logout       │                             │
└──────────────┴─────────────────────────────┘
```

Mobile:

Gunakan:

```text
Top Bar
+
Drawer Navigation
```

---

# 19. Admin Dashboard

Dashboard menampilkan informasi singkat:

```text
Today's Orders
Today's Revenue
Pending Orders
Completed Orders
```

Contoh:

```text
┌──────────────┐
│ Orders Today │
│     25       │
└──────────────┘

┌──────────────┐
│ Revenue      │
│ Rp 2.450.000 │
└──────────────┘
```

Jangan membuat dashboard terlalu kompleks.

---

# 20. Incoming Orders

Halaman paling penting untuk Kasir.

URL:

```text
/admin/orders
```

Order baru harus terlihat jelas.

Contoh:

```text
┌─────────────────────────────────────┐
│ NEW ORDER                          │
│                                     │
│ #ORD-00123                          │
│ Customer Name                       │
│ 3 Items                             │
│ Rp 125.000                          │
│                                     │
│ [ View ] [ Accept Order ]           │
└─────────────────────────────────────┘
```

---

# 21. Real-time Order Notification

Ketika order baru masuk:

1. Update order list secara real-time.
2. Tampilkan notification.
3. Mainkan sound/audio alert.
4. Tampilkan visual indicator.
5. Jika memungkinkan, gunakan browser notification setelah user memberikan permission.

Contoh:

```text
New Order!

Order #ORD-00123
Rp 125.000

[View Order]
```

Sound tidak boleh dimainkan terus-menerus.

Admin harus dapat menghentikan/mengakui notification.

Contoh:

```text
[ Acknowledge ]
```

---

# 22. Order Detail — Admin

```text
Order #ORD-00123

Customer
John Doe
+82 xxx xxxx

Items
--------------------------------
Fried Chicken     2x   Rp 50.000
Rice              2x   Rp 20.000
--------------------------------
Total                  Rp 70.000

Payment
Transfer Bank

Payment Proof
[ View Image ]

Status

[ Confirm Payment ]

[ Start Preparing ]

[ Ready ]

[ Complete ]
```

---

# 23. Product Management

URL:

```text
/admin/products
```

Tabs:

```text
[ Restaurant Menu ] [ Raw Material ]
```

Table desktop:

```text
Image | Product | Category | Price | Stock | Status | Action
```

Mobile:

Gunakan card list agar table tidak terlalu sempit.

Actions:

```text
Edit
Delete
```

---

# 24. Add / Edit Product

Form:

```text
Product Image

Product Name

Category

Description

Price

Weight / Unit

Stock

Status

[ Save Product ]
```

Product type:

```text
Restaurant Menu
Raw Material
```

Image upload harus menyediakan preview.

---

# 25. Reports

URL:

```text
/admin/reports
```

Filter:

```text
Today
This Week
This Month
Custom Date
```

Summary:

```text
Total Orders
Total Revenue
Completed Orders
Cancelled Orders
```

Contoh:

```text
Revenue Summary

Today
Rp 2.450.000

This Month
Rp 48.500.000
```

---

# 26. Transaction Report

Tampilkan:

```text
Date
Order Number
Customer
Total
Payment Status
Order Status
```

Actions:

```text
View
Print
```

---

# 27. Print

Support browser printing menggunakan:

```text
window.print()
```

Tidak perlu membuat sistem printer khusus pada tahap awal.

## Printable Order

Format sederhana:

```text
================================
        RESTAURANT NAME
================================

Order: #ORD-00123
Date: 24 Aug 2026

Customer:
John Doe
+82 xxx xxxx

--------------------------------
Product       Qty       Total
--------------------------------
Product A      2       50.000
Product B      1       25.000
--------------------------------

TOTAL                 75.000

Payment:
Bank Transfer

Status:
PAID

================================
       Thank You
================================
```

---

# 28. Super Admin

Super Admin hanya untuk internal developer.

Frontend Super Admin tidak perlu menjadi fokus utama.

Menu:

```text
Dashboard
Users
System Logs
Audit Logs
Settings
```

## Audit Log

Informasi:

```text
Timestamp
User
Action
Resource
IP / Metadata
```

Contoh:

```text
24 Aug 2026 10:30
admin@example
UPDATE_PRODUCT
Product #123
```

---

# 29. Components

Komponen frontend yang disarankan:

```text
components/
├── common/
│   ├── AppButton.vue
│   ├── AppInput.vue
│   ├── AppModal.vue
│   ├── AppToast.vue
│   ├── AppLoading.vue
│   └── AppEmptyState.vue
│
├── layout/
│   ├── PublicHeader.vue
│   ├── PublicFooter.vue
│   ├── AdminSidebar.vue
│   └── AdminHeader.vue
│
├── product/
│   ├── ProductCard.vue
│   ├── ProductGrid.vue
│   ├── ProductCategory.vue
│   └── ProductForm.vue
│
├── cart/
│   ├── CartItem.vue
│   └── CartSummary.vue
│
├── order/
│   ├── OrderCard.vue
│   ├── OrderStatus.vue
│   ├── OrderItem.vue
│   └── PaymentProof.vue
│
└── notification/
    └── OrderNotification.vue
```

---

# 30. Pages

Recommended route structure:

```text
/
├── /menu
├── /raw-material
├── /products/:id
├── /cart
├── /checkout
├── /order-success/:id
├── /orders/:id
│
├── /login
├── /register
├── /verify-otp
└── /forgot-password
│
└── /admin
    ├── /dashboard
    ├── /orders
    ├── /orders/:id
    ├── /products
    ├── /products/create
    ├── /products/:id/edit
    ├── /reports
    ├── /transactions
    └── /settings
```

---

# 31. State Management

Gunakan Pinia.

Stores:

```text
authStore
productStore
cartStore
orderStore
notificationStore
```

Contoh:

```text
authStore
- user
- role
- token
- login()
- logout()

cartStore
- items
- total
- addItem()
- removeItem()
- updateQuantity()
- clearCart()

orderStore
- currentOrder
- orders
- createOrder()
- getOrder()
```

---

# 32. Authentication & Role Guard

Frontend harus membatasi halaman berdasarkan role.

Roles:

```text
SUPER_ADMIN
ADMIN
CASHIER
MEMBER
GUEST
```

Contoh:

```text
/admin/*
```

hanya dapat diakses:

```text
SUPER_ADMIN
ADMIN
CASHIER
```

Audit log:

```text
SUPER_ADMIN
```

Member tidak boleh membuka admin route hanya dengan memanipulasi frontend.

Authorization tetap harus dilakukan oleh backend.

Frontend route guard hanya sebagai UX/security layer tambahan.

---

# 33. Loading State

Setiap request API harus memiliki loading state.

Contoh:

```text
[ Loading... ]
```

Untuk button:

```text
[ Saving... ]
```

Jangan membuat user menekan tombol berkali-kali ketika request sedang berlangsung.

---

# 34. Error State

Gunakan pesan yang mudah dipahami.

Buruk:

```text
Error 500
```

Lebih baik:

```text
Something went wrong.
Please try again.
```

Contoh:

```text
Failed to load products.

[ Try Again ]
```

---

# 35. Empty State

Contoh cart:

```text
Your cart is empty.

Add some delicious items to your order.

[ Browse Menu ]
```

Admin:

```text
No orders found.
```

---

# 36. Toast Notification

Gunakan toast untuk aksi singkat:

```text
Product added to cart
Product updated
Order created
Payment proof uploaded
```

Error:

```text
Failed to upload payment proof.
```

Toast jangan digunakan untuk informasi yang membutuhkan tindakan penting.

---

# 37. Accessibility

Minimal:

- Semua button memiliki label jelas.
- Input memiliki label.
- Image memiliki alt text.
- Kontras warna cukup.
- Keyboard navigation dasar.
- Focus state terlihat.
- Jangan menggunakan warna sebagai satu-satunya indikator status.

---

# 38. Performance

Prioritas:

- Compress image sebelum upload jika memungkinkan.
- Gunakan lazy loading untuk gambar produk.
- Hindari dependency besar yang tidak diperlukan.
- Gunakan pagination untuk product/order list.
- Jangan load seluruh data transaksi sekaligus.
- Gunakan loading skeleton untuk halaman utama.

---

# 39. Security Considerations

Frontend tidak boleh menyimpan data sensitif secara sembarangan.

Token authentication mengikuti mekanisme yang ditentukan backend.

Frontend tidak boleh mempercayai:

```text
price
role
permission
order total
```

yang berasal dari client.

Backend harus menjadi sumber kebenaran.

---

# 40. Real-time Notification

Untuk MVP, gunakan salah satu:

### Recommended

WebSocket / Socket.IO

```text
Backend
   ↓
WebSocket
   ↓
Admin Dashboard
   ↓
New Order Notification
   ↓
Sound Alert
```

Fallback apabila WebSocket belum tersedia:

```text
Polling setiap beberapa detik
```

Namun untuk kebutuhan "real-time wajib", WebSocket lebih disarankan.

---

# 41. Audio Alert

File:

```text
/public/sounds/new-order.mp3
```

Ketika order baru diterima:

```text
playNewOrderSound()
```

Perhatikan browser autoplay policy.

Audio sebaiknya diaktifkan setelah kasir melakukan interaksi pertama pada dashboard.

UI:

```text
Sound Alert: ON
```

Kasir dapat mematikan/mengaktifkan sound.

---

# 42. Mobile Admin

Admin/kasir kemungkinan menggunakan tablet atau HP.

Bottom navigation dapat digunakan:

```text
┌─────────────────────────────────┐
│                                 │
│          MAIN CONTENT           │
│                                 │
├─────────────────────────────────┤
│ Dashboard │ Orders │ Products │ More │
└─────────────────────────────────┘
```

Order baru harus tetap terlihat walaupun admin sedang berada di halaman lain.

---

# 43. UX Priority

Prioritas pengalaman pengguna:

### Customer

```text
Browse
  ↓
Select Product
  ↓
Add Cart
  ↓
Checkout
  ↓
Payment
  ↓
Upload Proof
  ↓
Track Order
```

Tidak boleh ada langkah yang tidak diperlukan.

### Cashier

```text
Receive Notification
        ↓
View Order
        ↓
Confirm Payment
        ↓
Prepare
        ↓
Complete
```

---

# 44. MVP Scope

Karena budget proyek adalah Rp3.000.000 dan deadline maksimal 20 September, frontend harus fokus pada fitur inti.

## P0 — Wajib

- [ ] Homepage
- [ ] Product listing
- [ ] Category Restaurant Menu / Raw Material
- [ ] Product detail
- [ ] Cart
- [ ] Guest checkout
- [ ] Member login/register
- [ ] OTP verification UI
- [ ] Payment transfer
- [ ] Upload payment proof
- [ ] Order tracking
- [ ] Admin dashboard
- [ ] Order monitoring
- [ ] Real-time order notification
- [ ] Sound alert
- [x] Product CRUD UI
- [ ] Daily/monthly report UI
- [ ] Print order
- [ ] Print report

## P1 — Jika waktu memungkinkan

- [ ] Browser notification
- [ ] Better dashboard analytics
- [ ] Advanced filtering
- [ ] Search product
- [ ] Custom date report
- [ ] Improved audit log UI

## P2 — Tidak perlu untuk MVP

- [ ] Loyalty program
- [ ] Coupon system
- [ ] Complex promotion engine
- [ ] Multiple payment gateway
- [ ] Advanced analytics
- [ ] Multi-branch management
- [ ] Complex inventory management

---

# 45. Suggested Project Structure

```text
src/
├── assets/
├── components/
├── layouts/
├── pages/
├── router/
├── stores/
├── services/
│   └── api.ts
├── composables/
├── types/
├── utils/
├── App.vue
└── main.ts
```

---

# 46. Environment Variables

Frontend:

```text
VITE_API_URL=
```

Contoh development:

```text
VITE_API_URL=http://localhost:8000/api
```

Production:

```text
VITE_API_URL=https://api.example.com/api
```

Jangan menyimpan secret key di frontend.

---

# 47. Hosting

Frontend harus dibuat sebagai static build agar mudah ditempatkan pada hosting gratis.

Build:

```bash
npm run build
```

Output:

```text
dist/
```

Target hosting harus mendukung static website dan HTTPS.

Domain/hosting gratis dapat digunakan untuk tahap awal sesuai kebutuhan client.

---

# 48. Design Principle

Gunakan prinsip berikut selama development:

> Simple is better.

Jangan membuat fitur frontend yang tidak dibutuhkan.

Setiap halaman harus menjawab satu kebutuhan utama.

Customer harus dapat melakukan:

```text
Menu → Cart → Checkout → Payment
```

dengan sesedikit mungkin klik.

Kasir harus dapat melakukan:

```text
New Order → Confirm → Prepare → Complete
```

dengan cepat.

---

# 49. Final UI Goal

Hasil akhir yang diharapkan:

```text
                 RESTAURANT
                      │
        ┌─────────────┴─────────────┐
        │                           │
   Restaurant Menu             Raw Material
        │                           │
        └─────────────┬─────────────┘
                      │
                   Product
                      │
                    Cart
                      │
                  Checkout
                      │
                 Bank Transfer
                      │
                Payment Proof
                      │
                  New Order
                      │
                ┌─────┴─────┐
                │           │
             Cashier      Admin
                │           │
             Prepare      Reports
                │
             Complete
```

Target utama frontend adalah **cepat, sederhana, responsif, mudah dipelihara, dan tidak over-engineered**.
