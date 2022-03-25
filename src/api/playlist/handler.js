class PlaylistsHandler {
  constructor(services, collaborationsService, songsService, validator) {
    this._service = services;
    this._collaborationsService = collaborationsService;
    this._songsService = songsService;
    this._validator = validator;

    // this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    // this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    // this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongHandler = this.getPlaylistSongHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
    this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this);

    // this.postSongToplaylistHandler = this.postSongToPlaylistHandler.bind(this);
    // this.getSongsWithPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
    // this.deleteSongByFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);

    // this.getActivitiesHandler = this.getPlaylistSongActivitiesHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._playlistsService.addPlaylist({ name, owner: credentialId });

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
    const playlists = await this._playlistsService.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  // async getPlaylistByIdHandler(request) {
  //   const { id } = request.params;
  //   const { id: credentialId } = request.auth.credentials;

  //   await this._playlistsService.verifyPlaylistAccess(id, credentialId);
  //   const playlist = await this._playlistsService.getPlaylistById(id);

  //   return {
  //     status: 'success',
  //     data: {
  //       playlist,
  //     },
  //   };
  // }

  // async putPlaylistByIdHandler(request) {
  //   this._validator.validatePlaylistPayload(request.payload);
  //   const { id } = request.params;
  //   const { id: credentialId } = request.auth.credentials;

  //   await this._playlistsService.verifyPlaylistAccess(id, credentialId);
  //   await this._playlistsService.editPlaylistById(id, request.payload);

  //   return {
  //     status: 'success',
  //     message: 'Playlist berhasil diperbarui',
  //   };
  // }

  async deletePlaylistByIdHandler(request) {
    const { idPlaylist } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(idPlaylist, credentialId);
    await this._playlistsService.deletePlaylistById(idPlaylist);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  // Post song in playlist
  async postPlaylistSongHandler(request, h) {
    this._validator.validatePostSongToPlaylistPayload(request.payload);
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._songsService.getSongById(songId);
    await this._service.verifyPlaylistsAccess(playlistId, credentialId);
    await this._service.addSongToPlaylist(playlistId, songId);

    // add activities
    await this._service.addPlaylistActivities(
      playlistId,
      songId,
      credentialId,
      'add',
    );

    return h
      .response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      })
      .code(201);
  }

  // Get songs in playlist
  async getPlaylistSongHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistsAccess(playlistId, credentialId);
    const playlistDetails = await this._service.getPlaylistDetails(
      playlistId,
    );
    const playlistSongs = await this._service.getPlaylistSongs(playlistId);
    return {
      status: 'success',
      data: {
        playlist: {
          id: playlistDetails.id,
          name: playlistDetails.name,
          username: playlistDetails.username,
          songs: playlistSongs,
        },
      },
    };
  }

  // Delete song in playlist
  async deletePlaylistSongHandler(request) {
    this._validator.validatePostSongToPlaylistPayload(request.payload);
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._service.verifyPlaylistsAccess(playlistId, credentialId);

    await this._service.deleteSongFromPlaylist(
      playlistId,
      songId,
      credentialId,
    );

    // add activities
    await this._service.addPlaylistActivities(
      playlistId,
      songId,
      credentialId,
      'delete',
    );

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

  // async postSongToPlaylistHandler(request, h) {
  //   this._validator.validatePlaylistSongPayload(request.payload);

  //   const { idPlaylist } = request.params;
  //   const { id: credentialId } = request.auth.credentials;
  //   const { songId } = request.payload;

  //   await this._songsService.verifyExistingSongById(songId);
  //   await this._playlistsService.addSongToPlaylist(idPlaylist, songId, credentialId);
  //   // await this._playlistsService.addPlaylistSongActivities(
  //   //   idPlaylist,
  //   //   songId,
  //   //   credentialId,
  //   //   'add',
  //   // );

  //   const response = h.response({
  //     status: 'success',
  //     message: 'Lagu berhasil ditambahkan ke dalam playlist',
  //   });
  //   response.code(201);
  //   return response;
  // }

  // async getSongsFromPlaylistHandler(request) {
  //   const { id } = request.params;
  //   const { id: credentialId } = request.auth.credentials;

  //   const songsFromPlaylist = await this._playlistsService.getSongsFromPlaylist(id, credentialId);

  //   return {
  //     status: 'success',
  //     data: {
  //       song: songsFromPlaylist,
  //     },
  //   };
  // }

  // async deleteSongFromPlaylistHandler(request) {
  //   const { idPlaylist } = request.params;
  //   const { id: credentialId } = request.auth.credentials;
  //   const { songId } = request.payload;

  //   await this._playlistsService.deleteSongFromPlaylist(idPlaylist, songId, credentialId);

  //   return {
  //     status: 'success',
  //     message: 'Lagu berhasil dihapus dari playlist',
  //   };
  // }

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
