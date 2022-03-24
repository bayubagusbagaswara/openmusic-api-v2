class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);

    this.postSongToplaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsWithPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
    this.deleteSongByFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);

    this.getActivitiesHandler = this.getPlaylistSongActivitiesHandler.bind(this);
  }

  // handler membuat playlist
  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._service.addPlaylist(name, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  // ambil playlist
  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists: playlists.map((playlist) => ({
          id: playlist.id,
          name: playlist.name,
          username: playlist.usernane,
        })),
      },
    };
  }

  // menghapus playlist berdasarkan id
  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistById(id, credentialId);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._service.verifyPlaylistAccess(id, credentialId);
    await this._service.verifyExistingSongById(songId);
    await this._service.addSongToPlaylist(id, songId);
    await this._service.addPlaylistSongActivities(
      id,
      songId,
      credentialId,
      'add',
    );

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke dalam playlist',
    });
    response.code(201);
    return response;
  }

  async getSongsFromPlaylistHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(id, credentialId);

    const playlist = await this._service.getPlaylistById(id);
    const songs = await this._service.getSongsFromPlaylist(id);

    const playlistContainSongs = { ...playlist, songs };

    return {
      status: 'success',
      data: {
        playlist: playlistContainSongs,
      },
    };
  }

  async deleteSongFromPlaylistHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._service.verifyPlaylistAccess(id, credentialId);
    await this._service.deleteSongFromPlaylist(id, songId);
    await this._service.addPlaylistSongActivities(
      id,
      songId,
      credentialId,
      'delete',
    );

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  async getPlaylistSongActivitiesHandler(request) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    const playlist = await this._service.getPlaylistById(playlistId);
    const activities = await this._service.getPlaylistSongActivities(playlistId);

    return {
      status: 'success',
      data: {
        playlistId: playlist.id,
        activities: activities.map((activity) => ({
          username: activity.username,
          title: activity.title,
          action: activity.action,
          time: activity.time,
        })),
      },
    };
  }
}

module.exports = PlaylistsHandler;
