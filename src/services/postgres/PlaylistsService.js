const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { mapDBToModel } = require('../../utils');

class PlaylistsService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
  }

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

  async getPlaylistsByUserId(owner) {
    const query = {
      text: `SELECT playlists.*, users.username FROM playlists
        LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
        LEFT JOIN users ON playlists.owner = users.id
        WHERE playlists.owner = $1 OR collaborations.user_id = $1
        GROUP BY playlists.id, users.username`,
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModel);
  }

  async getPlaylistById(id) {
    const query = {
      text: `SELECT playlists.*, users.username 
        FROM playlists 
        LEFT JOIN users ON users.id = playlists.owner
        WHERE playlists.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    return result.rows.map(mapDBToModel)[0];
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

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

  // async addPlaylistSongActivities(playlistId, songId, userId, action) {
  //   const id = `playlist_song_activities-${nanoid(16)}`;
  //   const time = new Date().toISOString();

  //   const query = {
  //     text: 'INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action, time) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
  //     values: [id, playlistId, songId, userId, action, time],
  //   };

  //   const result = await this._pool.query(query);
  //   if (!result.rows[0].id) {
  //     throw new InvariantError('Aktivitas gagal ditambahkan');
  //   }

  //   return result.rows[0].id;
  // }

  // async getPlaylistSongActivities(playlistId) {
  //   const query = {
  //     text: `SELECT playlist_song_activities.*, users.username, songs.title
  //     FROM playlist_song_activities
  //     LEFT JOIN users ON playlist_song_activities.user_id = users.id
  //     LEFT JOIN songs ON playlist_song_activities.song_id = songs.id
  //     WHERE playlist_song_activities.playlist_id = $1
  //     ORDER BY playlist_song_activities.time`,
  //     values: [playlistId],
  //   };

  //   const result = await this._pool.query(query);
  //   if (!result.rowCount) {
  //     throw new NotFoundError('Aktivitas tidak ditemukan');
  //   }

  //   return result.rows;
  // }

  // async verifyPostSongToPlaylist(songId) {
  //   const query = {
  //     text: 'SELECT * FROM songs WHERE id = $1',
  //     values: [songId],
  //   };

  //   const result = await this._pool.query(query);
  //   if (!result.rows.length) {
  //     throw new NotFoundError('Lagu tidak ditemukan');
  //   }
  // }

  // async verifyPlaylistAccess(playlistId, userId) {
  //   const query = {
  //     text: `SELECT playlist.id
  //     FROM playlists
  //     INNER JOIN users ON playlists.owner = users.id
  //     LEFT JOIN collaborations ON collaborations.playlist_id = playlist.id
  //     WHERE (playlist.owner = $1 OR collaborations.user_id = $1) AND playlists.id = $2`,
  //     values: [userId, playlistId],
  //   };

  //   const result = await this._pool.query(query);
  //   if (!result.rows[0]) {
  //     throw new AuthorizationError('Anda bukan collaborator playlist ini');
  //   }
  // }

  // async verifyPlaylistIsExist(playlistId) {
  //   const query = {
  //     text: 'SELECT COUNT(1) FROM playlist WHERE id = $1',
  //     values: [playlistId],
  //   };

  //   const result = await this._pool.query(query);

  //   if (!result) {
  //     throw new NotFoundError('Playlist yang dicari tidak ditemukan');
  //   }
  // }
}

module.exports = PlaylistsService;
