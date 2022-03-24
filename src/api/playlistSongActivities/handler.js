class PlaylistSongActivitiesHandler {
  // disini butuh service playlistSongActivitiesService dan playlistService
  // atau di server.js, kita tuliskan options service: playlistSongActivitiesService, playlistsService
  // jadi tinggal tuliskan constructor(service)
  // disini tidak butuh validator, karena hanya menangani proses GET
  constructor(playlistSongActivitiesService, playlistsService) {
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._playlistsService = playlistsService;

    this.getPlaylistSongActivitiesHandler = this.getPlaylistSongActivitiesHandler.bind(this);
  }

  async getPlaylistSongActivitiesHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);

    const playlist = await this._playlistsService.getPlaylistById(id);
    const activities = await this._playlistSongActivitiesService.getPlaylistSongActivities(id);

    return {
      status: 'success',
      data: {
        playlistId: playlist.id,
        activities,
      },
    };
  }
}

module.exports = PlaylistSongActivitiesHandler;
