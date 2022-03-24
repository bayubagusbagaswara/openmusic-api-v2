class PlaylistsHandler {
  constructor(playlistsService, playlistSongsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._playlistsSongsService = playlistSongsService;
    this._songsService = songsService;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);

    this.postSongToplaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsWithPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
    this.deleteSongByFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);

    // this.getActivitiesHandler = this.getPlaylistSongActivitiesHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._playlistsService.addPlaylist(name, credentialId);

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

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylistsByUserId(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { idPlaylist } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.deletePlaylistById(idPlaylist, credentialId);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { idPlaylist } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._songsService.verifyExistingSongById(songId);
    await this._playlistsService.addSongToPlaylist(idPlaylist, songId, credentialId);
    // await this._playlistsService.addPlaylistSongActivities(
    //   idPlaylist,
    //   songId,
    //   credentialId,
    //   'add',
    // );

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

    const songsFromPlaylist = await this._playlistsService.getSongsFromPlaylist(id, credentialId);

    return {
      status: 'success',
      data: {
        song: songsFromPlaylist,
      },
    };
  }

  async deleteSongFromPlaylistHandler(request) {
    const { idPlaylist } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._playlistsService.deleteSongFromPlaylist(idPlaylist, songId, credentialId);
    // await this._playlistsService.addPlaylistSongActivities(
    //   id,
    //   songId,
    //   credentialId,
    //   'delete',
    // );

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  // async getPlaylistSongActivitiesHandler(request) {
  //   const { playlistId } = request.params;
  //   const { id: credentialId } = request.auth.credentials;

  //   await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

  //   const playlist = await this._playlistsService.getPlaylistById(playlistId);
  //   const activities = await this._playlistsService.getPlaylistSongActivities(playlistId);

  //   return {
  //     status: 'success',
  //     data: {
  //       playlistId: playlist.id,
  //       activities: activities.map((activity) => ({
  //         username: activity.username,
  //         title: activity.title,
  //         action: activity.action,
  //         time: activity.time,
  //       })),
  //     },
  //   };
  // }
}

module.exports = PlaylistsHandler;
