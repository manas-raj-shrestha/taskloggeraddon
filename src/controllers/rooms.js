import { Router } from 'express';
import HttpStatus from 'http-status-codes';
import * as taskService from '../services/taskService';
import { findUser, userValidator } from '../validators/taskValidator';
import messageValidator from '../validators/messageValidator';
import * as roomService from '../services/roomService';
import * as hipchatService from '../services/hipchatService';

const router = Router();

router.post('/installation', (req, res, next) => {
  roomService
    .addRoomInfo(req.body)
    .then(async room => {
      let accessToken = await fetchAccessToken(room.toJSON());

      roomService.updateRoom(room.toJSON().id, accessToken);

      hipchatService.createRoomWebHook(room.toJSON().roomId, accessToken, {
        name: 'Task List',
        key: '12343215',
        pattern: '/tasks',
        url: 'http://2aca1954.ngrok.io/api/tasks/list',
        event: 'room_message',
        authentication: 'none'
      });

      hipchatService.createRoomWebHook(room.toJSON().roomId, accessToken, {
        name: 'Task Create',
        key: '12343214',
        pattern: '/task',
        url: 'http://2aca1954.ngrok.io/api/tasks',
        event: 'room_message',
        authentication: 'none'
      });

      res.status(HttpStatus.CREATED).json({ room });
    })
    .catch(err => next(err));
});

async function fetchAccessToken(room) {
  let accessToken = await hipchatService.fetchAccessToken(room.oauthId, room.oauthSecret);

  return accessToken;
}

export default router;
