function validateTask(task) {
  let reg = /\/task #[0-9]*.[0-9]*[h,m] \w*/;

  return reg.test(task);
}

/**
 * Validate create/update user request.
 *
 * @param  {object}   req
 * @param  {object}   res
 * @param  {function} next
 * @return {Promise}
 */
function messageValidator(req, res, next) {
  //   console.log('request', req);

  if (!validateTask(req.body.item.message.message)) {
    const response = {
      color: 'red',
      message: `@${req.body.item.message.from.mention_name} Invalid task format\nExample: #2h Completed Sign-Up`,
      notify: true,
      message_format: 'text'
    };
    res.json(response);

    return;
  }

  return next();
}

export default messageValidator;
