/* eslint-disable camelcase */
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

module.exports = { mapAlbumDBToModel, mapSongDBToModel };
