# OpenMusic API Versi 2

# Library
- npm init --y
- npm install nodemon --save-dev
- npm install eslint --save-dev
- npx eslint --init
- npm install @hapi/hapi
- npm install nanoid

- npm install joi
- npm install pg
- npm install dotenv
- npm install node-pg-migrate

- kemudian buat scripts di package.json `"migrate": "node-pg-migrate"`
- npm run migrate up

- npm install bcrypt
- npm install @hapi/jwt
- require('crypto').randomBytes(64).toString('hex');

- truncate albums, songs, users, authentications, playlists, playlistsongs, playlist_song_activities, collaborations;

# Langkah-Langkah

- Kita perbaiki dulu OpenMusic API V1 - berdasarkan hasil reviewer

# Create Table
- npm run migrate create "create table songs"
- create-table-album
- create-table-song
- create-table-user
- create-table-authentications
- create-table-playlist
- create-table-playlist-songs
- add-foreign-key-to-album-id-column
- create-table-collaborations
- create-table-playlist-song-activities