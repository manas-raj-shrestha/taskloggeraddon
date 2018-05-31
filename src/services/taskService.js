import Boom from 'boom';
import User from '../models/user';
import Task from '../models/task';
import dateFormat from 'dateformat';

/**
 * Get all users.
 *
 * @return {Promise}
 */
export function getAllUsers() {
  return User.fetchAll();
}

/**
 * Get a user.
 *
 * @param  {Number|String}  id
 * @return {Promise}
 */
export function getUser(id) {
  return new User({ id }).fetch().then(user => {
    if (!user) {
      throw new Boom.notFound('User not found');
    }

    return user;
  });
}

export async function getTasks(requestBody) {
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  let startDate = dateFormat(new Date(), 'yyyy-mm-dd');
  let endDate = dateFormat(tomorrow, 'yyyy-mm-dd');

  let user = await new User({ hipchatUserId: requestBody.item.message.from.id }).fetch();

  return Task.query(function(qb) {
    qb.whereBetween('created_at', [startDate, endDate]);
    qb.where('user_id', user.id);
  })
    .fetchAll()
    .then(tasks => {
      let tasksResponse = `Tasks for ${startDate}\n`;
      tasks.forEach(function(task) {
        tasksResponse += `${tasks.indexOf(task) + 1}. ${task.get('name')} \n`;
      });

      if (tasks === undefined || tasks.length == 0) {
        tasksResponse = 'No tasks recorded for today';
      }

      return tasksResponse;
    });
}

function formatMessage(message) {
  return message.substr(message.indexOf(' ') + 1);
}

/**
 * Create new user.
 *
 * @param  {Object}  user
 * @return {Promise}
 */
export async function addTask(body) {
  const reqHipChatId = body.item.message.from.id;
  let user = await new User({ hipchatUserId: body.item.message.from.id }).fetch();

  if (!user) {
    user = await new User({ hipchatUserId: reqHipChatId, userName: body.item.message.from.name }).save();
  }

  return new Task()
    .save({ userId: user.id, name: formatMessage(body.item.message.message) })
    .then(task => task.refresh());
}

/**
 * Update a user.
 *
 * @param  {Number|String}  id
 * @param  {Object}         user
 * @return {Promise}
 */
export function updateUser(id, user) {
  return new User({ id }).save({ name: user.name }).then(user => user.refresh());
}

/**
 * Delete a user.
 *
 * @param  {Number|String}  id
 * @return {Promise}
 */
export function deleteUser(id) {
  return new User({ id }).fetch().then(user => user.destroy());
}
