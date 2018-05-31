import Boom from 'boom';
import User from '../models/user';
import Room from '../models/room';
import dateFormat from 'dateformat';
import axios from 'axios';

export async function fetchAccessToken(username, password) {
  let auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

  try {
    let response = await axios.post('https://api.hipchat.com/v2/oauth/token', 'grant_type=client_credentials', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: auth,
        'Cache-Control': 'no-cache'
      }
    });

    console.log('0', response.data.access_token);

    return response.data.access_token;
  } catch (err) {
    throw err;
  }
}

export async function createRoomWebHook(roomId, access_token, taskCreationHook) {
  axios
    .put(
      `https://api.hipchat.com/v2/room/${roomId}/extension/webhook/${taskCreationHook.key}?auth_token=${access_token}`,
      taskCreationHook
    )
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
}
