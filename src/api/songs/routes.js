const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postSongHandler, // postSongHandler hanya menerima dan menyimpan "satu" lagu.
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getSongsHandler, // getSongsHandler mengembalikan "banyak" lagu.
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getSongByIdHandler, // getSongByIdHandler mengembalikan "satu" lagu.
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.putSongByIdHandler, // putSongByIdHandler hanya menerima dan mengubah "satu" lagu.
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteSongByIdHandler, // deleteSongByHandler hanya menghapus "satu" lagu.
  },
];

module.exports = routes;
