const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const ClientError = require('../../exceptions/ClientError');

class PlaylistsService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
  }

  // ADD PLAYLIST
  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  // GET ALL PLAYLISTS
  async getPlaylists(owner) {
    // getPlaylist by owner artinya hanya owner ini yang bisa mengambil data playlist
    // data owner (table Playlist) == userId (table Users)
    // data id (Table Playlist) == playlist_id (table Collaborations)
    // pada saat getPlaylist ini kita hanya mengambil data playlist_id, playlist_name, dan username (diambil dari table Users)
    // jadi kita join table playlist, table collaborations, dan table users
    // yang bisa akses getPlaylist ini adalah users.id atau collaborations.user_id
    const query = {
      text: `SELECT playlists.*, users.username 
        FROM playlists
        LEFT JOIN users ON playlists.owner = users.id
        LEFT JOIN collaborations ON playlist.id = collaborations.playlist_id
        WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [owner],
    };

    // hasil query disini adalah data playlist_id, playlist_name, username
    const result = await this._pool.query(query);
    return result.rows;
  }

  // GET PLAYLIST BY ID

  // DELETE PLAYLIST BY ID
  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Playlist ID tidak ditemukan');
    }
  }

  /** SERVICE PLAYLIST SONGS */

  // ADD LAGU KE PLAYLIST
  async addSongToPlaylist({ playlistId, songId, credentialId }) {
    // menambahkan lagu ke playlist hanya bisa dilakukan oleh owner playlist atau collaborator
    const id = `playlist_song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambah di playlist');
    }

    const action = 'add';
    const userId = credentialId;

    await this._activitiesService.addActivity(playlistId, songId, userId, action);

    return result.rows[0].id;
  }

  // AMBIL SEMUA LAGU YANG ADA DI PLAYLIST
  async getSongsFromPlaylist(playlistId, owner) {
    const query1 = {
      text: `SELECT playlists.id, playlists.name, users.username 
        FROM playlists
        INNER JOIN users ON users.id = playlists.owner 
        WHERE playlists.id = $2 
        OR owner = $1 and playlists.id = $2`,
      values: [owner, playlistId],
    };

    const query2 = {
      text: `SELECT songs.id, songs.title, songs.performer 
        FROM songs
        LEFT JOIN playlist_songs ON playlist_songs.song_id = songs.id
        WHERE palylist_songs.playlist_id = $1 
        OR playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query1);
    const songs = await this._pool.query(query2);

    const combine = {
      ...result.rows[0],
      songs: [
        ...songs.rows],
    };

    if (!result.rows.length) {
      throw new NotFoundError('Playlist not found');
    }

    return combine;
  }

  // DELETE SONG FROM PLAYLIST
  async deleteSongFromPlaylist(playlistId, songId, credentialId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new ClientError('Lagu gagal dihapus dari playlist');
    }

    const action = 'delete';
    const userId = credentialId;

    await this._activitiesService.addActivity(playlistId, songId, userId, action);
  }

  /** VERIFIKASI */
  // VERIFIKASI PEMILIK PLAYLIST
  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini. Anda bukan pemilik playlist ini');
    }
  }

  // VERIFIKASI SONG, BAHWA EMANG ADA LAGU DI TABLE SONGS
  async verifySong(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Id lagu tidak ditemukan');
    }
  }

  // VERIFIKASI SIAPA SAJA YANG BISA AKSES PLAYLIST
  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationsService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
