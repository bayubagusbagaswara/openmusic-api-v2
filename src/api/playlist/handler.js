class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);

    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getPlaylistSongsHandler = this.getSongsFromPlaylistHandler.bind(this);
    this.deletePlaylistSongsHandler = this.deleteSongFromPlaylistHandler.bind(this);

    // this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({ name, owner: credentialId });

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

  async getPlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const filteredPlaylists = await this._service.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists: filteredPlaylists.map((playlist) => ({
          id: playlist.id,
          name: playlist.name,
          username: playlist.name,
        })),
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deletePlaylistById(playlistId);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  // Post song in playlist
  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistsAccess(playlistId, credentialId);
    await this._service.addSongToPlaylist(playlistId, songId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  // Get songs in playlist
  async getSongsFromPlaylistHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const playlist = await this._service.verifyPlaylistsAccess(playlistId, credentialId);

    const songs = await this._service.getSongsFromPlaylist(playlistId);

    const playlistContainSongs = { ...playlist, songs };

    return {
      status: 'success',
      data: {
        playlist: playlistContainSongs,
      },
    };
  }

  // Delete song in playlist
  async deleteSongFromPlaylistHandler(request) {
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistsAccess(playlistId, credentialId);

    await this._service.deleteSongFromPlaylist(playlistId, songId);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  // Get activities
  // async getPlaylistActivitiesHandler(request) {
  //   const { id: playlistId } = request.params;
  //   const { id: credentialId } = request.auth.credentials;
  //   await this._service.verifyPlaylistsAccess(playlistId, credentialId);
  //   const activities = await this._service.getPlaylistActivities(playlistId);
  //   return {
  //     status: 'success',
  //     data: {
  //       playlistId,
  //       activities,
  //     },
  //   };
  // }
}

module.exports = PlaylistsHandler;
