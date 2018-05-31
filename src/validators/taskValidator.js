import Joi from 'joi';
import validate from '../utils/validate';

const linksSchema = Joi.object().keys({
  self: Joi.string()
});

let fromSchema = Joi.object().keys({
  id: Joi.number(),
  links: linksSchema,
  mention_name: Joi.string(),
  name: Joi.string(),
  version: Joi.string()
});

const roomSchema = Joi.object().keys({
  id: Joi.number(),
  is_archived: Joi.boolean(),
  links: Joi.string(),
  name: Joi.string(),
  privacy: Joi.string(),
  version: Joi.string()
});

let messageSchema = Joi.object().keys({
  date: Joi.string(),
  from: fromSchema,
  id: Joi.string(),
  mentions: Joi.array().items(Joi.string()),
  message: Joi.string(),
  type: Joi.string()
});

let itemSchema = Joi.object().keys({
  message: messageSchema,
  room: roomSchema
});

let base = Joi.object({
  event: Joi.string(),
  item: itemSchema
});

/**
 * Validate create/update user request.
 *
 * @param  {object}   req
 * @param  {object}   res
 * @param  {function} next
 * @return {Promise}
 */
function userValidator(req, res, next) {
  return validate(req.body, base)
    .then(() => next())
    .catch(err => next(err));
}

export { userValidator };
