const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postPlaylistsongHandler,
    options: {
      auth: 'listsapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getPlaylistsongByIdHandler,
    options: {
      auth: 'listsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deletePlaylistsongHandler,
    options: {
      auth: 'listsapp_jwt',
    },
  },
];

module.exports = routes;
