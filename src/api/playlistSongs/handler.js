class PlaylistSongsHandler {
  constructor(
    playlistSongsService,
    playlistsService,
    songsService,
    usersService,
    playlistSongActivitiesService,
    validator,
  ) {
    this._playlistSongsService = playlistSongsService;
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._usersService = usersService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._validator = validator;

    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    await this._songsService.verifyExistingSongById(songId);
    await this._playlistSongsService.addSongToPlaylist(id, songId);
    await this._playlistSongActivitiesService.addPlaylistSongActivities(
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

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);

    const playlist = await this._playlistsService.getPlaylistById(id);

    const songs = await this._playlistSongsService.getSongsFromPlaylist(id);

    const { username } = await this._usersService.getUsernameById(
      playlist.owner,
    );

    return {
      status: 'success',
      data: {
        playlist: {
          id: playlist.id,
          name: playlist.name,
          username,
          songs,
        },
      },
    };
  }

  async deleteSongFromPlaylistHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    await this._playlistSongsService.deleteSongFromPlaylist(id, songId);
    await this._playlistSongActivitiesService.addPlaylistSongActivities(
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
}

module.exports = PlaylistSongsHandler;
