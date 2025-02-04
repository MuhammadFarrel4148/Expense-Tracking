# Expense Tracking
Aplikasi sederhana untuk manajemen keuangan

## Fitur Utama
- **User dapat menambahkan pengeluaran dengan deskripsi dan nominal**
- **User dapat melihat semua pengeluaran**
- **User dapat melihat ringkasan semua pengeluaran**
- **User dapat melihat pengeluaran pada bulan tertentu**
- **User dapat melakukan update pada pengeluaran**
- **User dapat melakukan delete pada pengeluaran**

## Fitur Tambahan
- **User dapat melakukan filter berdasarkan kategori deskripsi**
- **User dapat menambahkan budget di setiap bulan dan memberikan warning ketika pengeluaran melebihi budget**
- **Dapat melakukan export ke file CSV**

## Teknologi yang Digunakan
- **Node.js**: Runtime javascript
- **MySQL**: Database relasional
- **JWT**: Autentikasi
- **Postman**: Testing dan dokumentasi
- **Dotenv**: Mengelola environment variables
- **Nodemailer**: Mengirim pengingat melalui email
- **Docker** (opsional): containerization 
- **GitHub**: Version control dan menyimpan proyek

## Struktur Database
## Users Table
```json
{
    "id": "string PRIMARY KEY",
    "username": "string",
    "email": "string",
    "password": "string"
}
```

## Expense Table
```json
{
    "id": "string FOREIGN KEY TO Users(id)",
    "deskripsi": "string", //eat, shopping, needs
    "nominal": "integer",
    "date": "TIMESTAMP",
    "createdAt": "TIMESTAMP",
    "updatedAt": "TIMESTAMP",
}
```

## Instalasi (Coming Soon)
1. 

## Endpoint (API Routes)

| HTTP Method | Endpoint             | Deskripsi                                 |
|-------------|----------------------|-------------------------------------------|
| POST        | /register            | Daftar pengguna baru                      |
| POST        | /login               | Login pengguna                            |
| POST        | /forgotpassword      | Mengirimkan kode otorisasi melalui email  |
| POST        | /inpuotp             | Validasi kode otorisasi & input password baru |
| POST        | /expense             | Buat pengeluaran baru                     |
| GET         | /expense             | Ambil daftar semua pengeluaran atau dengan filter/sort |
| GET         | /expense/summary     | Ambil ringkasan pengeluaran               |
| PUT         | /expense/{id}        | Perbarui pengeluaran berdasarkan ID             |
| DELETE      | /expense/{id}        | Hapus pengeluaran berdasarkan ID                |

## Penulis
- **Muhammad Farrel Putra Pambudi**
    - ([GitHub](https://github.com/MuhammadFarrel4148))
    - ([LinkedIn](https://www.linkedin.com/in/farrelputrapambudi))