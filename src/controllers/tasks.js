import { Router } from 'express';
import HttpStatus from 'http-status-codes';
import * as taskService from '../services/taskService';
import { findUser, userValidator } from '../validators/taskValidator';
import messageValidator from '../validators/messageValidator';

const router = Router();

/**
 * GET /api/tasks
 */
router.post('/list', (req, res, next) => {
  // console.log('Date', Date.now());
  // data => res;

  const response = {
    color: 'green',
    message: `@${req.body.item.message.from.mention_name}'s task has been recorded`,
    notify: true,
    message_format: 'text'
  };

  taskService
    .getTasks(req.body)
    .then(data => {
      response.message = `${data}`;

      return res.json(response);
    })
    .catch(err => next(err));
});

/**
 * POST /api/tasks
 */
router.post('/', messageValidator, (req, res, next) => {
  console.log(req.body, req.body.item.message.from);

  taskService
    .addTask(req.body)
    .then(data => {
      const response = {
        color: 'green',
        message: `@${req.body.item.message.from.mention_name}'s task has been recorded`,
        notify: true,
        message_format: 'text'
      };

      return res.status(HttpStatus.CREATED).json(response);
    })
    .catch(err => next(err));
});

export default router;
