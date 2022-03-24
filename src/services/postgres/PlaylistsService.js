const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapPlaylistDBToModel } = require('../../utils');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  // add playlist POST /playlists
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

  // ambil semua playlist GET /playlist
  async getPlaylists(owner) {
    // cek owner nya ada atau tidak
    let query;
    if (owner) {
      query = {
        text: 'SELECT id, name, owner FROM playlist WHERE owner = $1',
        values: [owner],
      };
    } else {
      query = {
        text: 'SELECT id, name, owner FROM playlist',
      };
    }
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    return result.rows.map(mapPlaylistDBToModel);
  }

  // ambil playlist berdasarkan id GET /playlist/{id}
  async getPlaylistById(id) {
    const query = {
      text: 'SELECT id, name, owner FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapPlaylistDBToModel)[0];
  }

  // menghapus playlist berdasarkan id DELETE /playlist/{id}
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
}

module.exports = PlaylistsService;
