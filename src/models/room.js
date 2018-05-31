import bookshelf from '../db';

const TABLE_NAME = 'rooms';

/**
 * User model.
 */
class Room extends bookshelf.Model {
  get tableName() {
    return TABLE_NAME;
  }

  get hasTimestamps() {
    return true;
  }
}

export default Room;
