const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: handler.postAlbumHandler, // postAlbumHandler hanya menerima dan menyimpan "satu" album.
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: handler.getAlbumByIdHandler, // getAlbumByIdHandler mengembalikan "satu" album.
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: handler.putAlbumByIdHandler, // putAlbumByIdHandler hanya menerima dan mengubah "satu" album.
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: handler.deleteAlbumByIdHandler, // deleteAlbumByHandler hanya menghapus "satu" album.
  },
];

module.exports = routes;
