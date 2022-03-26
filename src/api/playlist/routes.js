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
    path: '/playlists/{id}',
    handler: handler.deletePlaylistByIdHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },

  /** ROUTE UNTUK PLAYLIST_SONGS */
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postSongToPlaylistHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getSongsFromPlaylistHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deleteSongFromPlaylistHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },

  /** ROUTES UNTUK PLAYLIST_SONG_ACTIVITIES */
  // {
  //   method: 'GET',
  //   path: '/playlists/{id}/activities',
  //   handler: handler.getPlaylistActivitiesHandler,
  //   options: {
  //     auth: 'openmusicapp_jwt',
  //   },
  // },
];

module.exports = routes;
