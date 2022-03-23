require('dotenv').config();

const Hapi = require('@hapi/hapi');
const songs = require('./api/songs');
const albums = require('./api/albums');
const SongsService = require('./services/postgres/SongsService');
const AlbumsService = require('./services/postgres/AlbumsService');
const SongsValidator = require('./validator/songs');
const AlbumsValidator = require('./validator/albums');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    }]);

  /*
  Di sini kamu bisa mendeklarasikan atau membuat extensions function untuk life cycle server onPreResponse, di mana ia akan mengintervensi response sebelum dikirimkan ke client. Di sana kamu bisa menetapkan error handling bila response tersebut merupakan client error.
  */

  // server.ext('onPreResponse', (request, h) => {
  //   // mendapatkan konteks response dari request
  //   const { response } = request;

  //   if (response instanceof ClientError) {
  //     // membuat response baru dari response toolkit sesuai kebutuhan error handling
  //     const newResponse = h.response({
  //       status: 'fail',
  //       message: response.message,

  //     });
  //     newResponse.code(response.statusCode);
  //     return newResponse;
  //   }

  //   // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)
  //   return response.continue || response;
  // });

  /*
  Dengan begitu, di handler, kamu bisa fokus terhadap logika dalam menangani request, tanpa adanya error handling.
  */

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
