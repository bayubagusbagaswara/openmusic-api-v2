class PlaylistsHandler {
  constructor(playlistsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
    this.deletePlaylistSongsHandler = this.deletePlaylistSongsHandler.bind(this);
    this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist({
      name,
      owner: credentialId,
    });

    return h
      .response({
        status: 'success',
        message: 'Playlist berhasil dibuat',
        data: {
          playlistId,
        },
      })
      .code(201);
  }

  async getPlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistsService.deletePlaylist(playlistId);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  // Post song in playlist
  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistsAccess(playlistId, credentialId);
    await this._playlistsService.addSongToPlaylist(playlistId, songId);

    // add activities
    // await this._service.addPlaylistActivities(
    //   playlistId,
    //   songId,
    //   credentialId,
    //   'add',
    // );

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  // Get songs in playlist
  async getPlaylistSongsHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistsAccess(playlistId, credentialId);

    const songs = await this._playlistsService.getSongsFromPlaylist(playlistId);

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  // Delete song in playlist
  async deletePlaylistSongsHandler(request) {
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistsAccess(playlistId, credentialId);

    await this._playlistsService.deleteSongFromPlaylistById(playlistId, songId);

    // add activities
    // await this._service.addPlaylistActivities(
    //   playlistId,
    //   songId,
    //   credentialId,
    //   'delete',
    // );

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  // Get activities
  async getPlaylistActivitiesHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistsAccess(playlistId, credentialId);
    const activities = await this._service.getPlaylistActivities(playlistId);
    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistsHandler;
