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

const mapUserDBToModel = ({
  id, username, password, fullname,
}) => ({
  id,
  username,
  password,
  fullname,
});

const mapPlaylistDBToModel = ({ id, name, owner }) => ({
  id,
  name,
  owner,
});

const mapPlaylistSongsDBToModel = ({ id, playlist_id, song_id }) => ({
  id,
  playlistId: playlist_id,
  songId: song_id,
});

const mapDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
  inserted_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

const mapCollaborationsDBToModel = ({ id, playlist_id, user_id }) => ({
  id,
  playlistId: playlist_id,
  userId: user_id,
});

const mapPlaylistSongActivitiesDBToModel = ({
  id, playlist_id, song_id, user_id, action, time,
}) => ({
  id,
  playlistId: playlist_id,
  songId: song_id,
  userId: user_id,
  action,
  time,
});

module.exports = {
  mapAlbumDBToModel, mapSongDBToModel, mapPlaylistDBToModel, mapUserDBToModel, mapPlaylistSongsDBToModel, mapCollaborationsDBToModel, mapPlaylistSongActivitiesDBToModel, mapDBToModel,
};
