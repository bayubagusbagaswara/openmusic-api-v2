/* eslint-disable camelcase */

// model untuk success response
const successResponse = (h, { code = 200, message, data }) => {
  const response = {
    status: 'success',
  };
  if (message) {
    response.message = message;
  } if (data) {
    response.data = data;
  }
  return h.response(response).code(code);
};

// model untuk fail response
const failResponse = (h, error) => (
  h.response({
    status: 'fail',
    message: error.message,
  }).code(error.statusCode));

// model untuk error response yang lain
const errorResponse = (h) => (
  h.response({
    status: 'error',
    message: 'Maaf, terjadi kegagalan pada server kami.',
  }).code(500));

const mapSongDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

const mapAlbumDBToModel = ({ id, name, year }) => ({
  id,
  name,
  year,
});

module.exports = {
  mapAlbumDBToModel, mapSongDBToModel, successResponse, failResponse, errorResponse,
};
