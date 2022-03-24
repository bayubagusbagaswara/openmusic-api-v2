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

const mapPlaylistDBToModel = ({ id, name, owner }) => ({
  id,
  name,
  owner,
});

module.exports = {
  mapAlbumDBToModel, mapSongDBToModel, mapPlaylistDBToModel,
};
