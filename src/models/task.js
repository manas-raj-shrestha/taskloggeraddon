import bookshelf from '../db';

const TABLE_NAME = 'tasks';

/**
 * User model.
 */
class Task extends bookshelf.Model {
  get tableName() {
    return TABLE_NAME;
  }

  get hasTimestamps() {
    return true;
  }
}

export default Task;
