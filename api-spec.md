# API Specification

# Kriteria 1 : Registrasi dan Autentikasi Pengguna

## Create User





## Ketentuan:

- Username harus unik.
- Authentication menggunakan JWT token.
- JWT token harus mengandung payload berisi userId yang merupakan id dari user autentik.
- Nilai secret key token JWT baik access token ataupun refresh token wajib menggunakan environment variable ACCESS_TOKEN_KEY dan REFRESH_TOKEN_KEY.
- Refresh token memiliki signature yang benar serta terdaftar di database.

# Kriteria 2 : Pengelolaan Data Playlist 


## Ketentuan:

- Playlist merupakan resource yang dibatasi (restrict). Untuk mengaksesnya membutuhkan access token.
- Playlist yang muncul pada GET /playlists hanya yang ia miliki saja.
- Hanya owner playlist (atau kolabolator) yang dapat menambahkan, melihat, dan menghapus lagu ke/dari playlist.
- songId dimasukkan/dihapus ke/dari playlist wajib bernilai id lagu yang valid.

- GET /playlist
```json
{
    "status": "success",
    "data": {
        "playlists": [
            {
                "id": "playlist-Qbax5Oy7L8WKf74l",
                "name": "Lagu Indie Hits Indonesia",
                "username": "dicoding"
            },
            {
                "id": "playlist-lmA4PkM3LseKlkmn",
                "name": "Lagu Untuk Membaca",
                "username": "dicoding"
            }
        ]
    }
}
```
- GET /playlists/{id}/songs:
```json
{
  "status": "success",
  "data": {
    "playlist": {
      "id": "playlist-Mk8AnmCp210PwT6B",
      "name": "My Favorite Coldplay",
      "username": "dicoding",
      "songs": [
        {
          "id": "song-Qbax5Oy7L8WKf74l",
          "title": "Life in Technicolor",
          "performer": "Coldplay"
        },
        {
          "id": "song-poax5Oy7L8WKllqw",
          "title": "Centimeteries of London",
          "performer": "Coldplay"
        },
        {
          "id": "song-Qalokam7L8WKf74l",
          "title": "Lost!",
          "performer": "Coldplay"
        }
      ]
    }
  }
}
```

- Objek playlists yang disimpan pada server harus memiliki struktur seperti contoh di bawah ini:
```json
{
    "id": "playlist-Qbax5Oy7L8WKf74l",
    "name": "Lagu Indie Hits Indonesia",
    "owner": "user-Qbax5Oy7L8WKf74l",
}
```

## Keterangan:

- Properti `owner` merupakan `user_id` dari pembuat playlist. Anda bisa mendapatkan nilainya melalui artifacts payload JWT.

# Kriteria 3 : Menerapkan Foreign Key

## Database wajib menerapkan Foreign Key. Contohnya relasi:

- Tabel songs terhadap albums;
- Tabel playlists terhadap users;
- Dan relasi tabel lainnya.

# Kriteria 4 : Menerapkan Data Validation
- Wajib menerapkan proses Data Validation pada Request Payload sesuai spesifikasi berikut:

## POST /users:
- username : string, required.
- password : string, required.
- fullname : string, required.
## POST /authentications:
- username : string, required.
- password : string, required.
## PUT /authentications:
- refreshToken : string, required.
## DELETE /authentications:
- refreshToken : string, required.
## POST /playlists:
- name : string, required.
# POST /playlists/{playlistId}/songs
- songId : string, required.

# Kriteria 5 : Penanganan Eror (Error Handling)

1. Ketika proses validasi data pada request payload tidak sesuai (gagal), server harus mengembalikan response:
```json
{
    status code: 400 (Bad Request)
response body:
status: fail
message: <apa pun selama tidak kosong>

}
```

2. Ketika pengguna mengakses resource yang tidak ditemukan, server harus mengembalikan response:
status code: 404 (Not Found)
response body:
status: fail
message: <apa pun selama tidak kosong>
3. Ketika pengguna mengakses resource yang dibatasi tanpa access token, server harus mengembalikan response:
status code: 401 (Unauthorized)
response body:
status: fail
message: <apa pun selama tidak kosong>
4. Ketika pengguna memperbarui access token menggunakan refresh token yang tidak valid, server harus mengembalikan response:
status code: 400 (Bad Request)
response body:
status: fail
message: <apa pun selama tidak kosong>
5. Ketika pengguna mengakses resource yang bukan haknya, server harus mengembalikan response:
status code: 403 (Forbidden)
response body:
status: fail
message: <apa pun selama tidak kosong>
6. Ketika terjadi server eror, server harus mengembalikan response:
status code: 500 (Internal Server Error)
Response body:
status: error
message: <apa pun selama tidak kosong>

# Kriteria 6 : Pertahankan Fitur OpenMusic API versi 1 
- Pastikan fitur dan kriteria OpenMusic API versi 1 tetap dipertahankan seperti:

- Pengelolaan data album.
- Pengelolaan data song.
- Menerapkan data validations resource album dan song.