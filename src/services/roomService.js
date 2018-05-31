import Boom from 'boom';
import User from '../models/user';
import Room from '../models/room';
import dateFormat from 'dateformat';

/**
 * Get all users.
 *
 * @return {Promise}
 */
export function getAllRooms() {
  return Room.fetchAll();
}

/**
 * Get a user.
 *
 * @param  {Number|String}  id
 * @return {Promise}
 */
export function getRoom(id) {
  return new Room({ roomId: id }).fetch().then(room => {
    if (!room) {
      throw new Boom.notFound('Room not found');
    }

    return room;
  });
}

/**
 * Create new user.
 *
 * @param  {Object}  user
 * @return {Promise}
 */
export async function addRoomInfo(body) {
  let room = new Room();
  try {
    await room.save({
      roomId: body.roomId,
      oauthId: body.oauthId,
      oauthSecret: body.oauthSecret,
      groupId: body.groupId
    });
  } catch (err) {
    console.log('catch', err);
    throw new Boom.badImplementation('Room insertion error');
  }

  return room;
}

/**
 * Update a user.
 *
 * @param  {Number|String}  id
 * @param  {Object}         user
 * @return {Promise}
 */
export function updateRoom(id, accessToken) {
  return new Room({ id }).save({ accessToken }).then(room => room.refresh());
}
