/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      references: 'playlists',
      onDelete: 'cascade',
    },
    song_id: {
      type: 'VARCHAR(50)',
      references: 'songs',
      onDelete: 'cascade',
    },
    user_id: {
      type: 'VARCHAR(50)',
      references: 'users',
      onDelete: 'cascade',
    },
    action: {
      type: 'TEXT',
      notNull: true,
    },
    time: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // pgm.addConstraint(
  //   'playlist_song_activities',
  //   'fk_playlist_song_activities.playlist_id_playlists.id',
  //   'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
  // );
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities');
};
