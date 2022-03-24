const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistsHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{idPlaylist}',
    handler: handler.deletePlaylistByIdHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{idPlaylist}/songs',
    handler: handler.postSongToPlaylistHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{idPlaylist}/songs',
    handler: handler.getSongsFromPlaylistHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{idPlaylist}/songs',
    handler: handler.deleteSongFromPlaylistHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
  // {
  //   method: 'GET',
  //   path: '/playlists/{idPlaylist}/activities',
  //   handler: handler.getPlaylistSongActivitiesHandler,
  //   options: {
  //     auth: 'openmusicapp_jwt',
  //   },
  // },
];

module.exports = routes;
