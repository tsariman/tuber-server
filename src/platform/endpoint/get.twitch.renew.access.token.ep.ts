import { authorization_key_save } from '../../model/authorization'
import axios from 'axios'
import {
  TWITCH_API_TOKEN_REQUEST_URL as REQUEST_URL,
  TWITCH_API_CLIENT_ID,
  TWITCH_API_CLIENT_SECRET
} from '../twitch'

// [TODO] If this endpoint is called to renew the access token, it should
//        also update the cron job with the new expiration date.

/**
 * Endpoint is meant to be called by the server to renew the access token.
 */
export default async function get_twitch_renew_access_token_endpoint() {
  // Twitch access token expires every 60 days. This is the logic to renew it.
  const response = await axios.post(REQUEST_URL, new URLSearchParams({
    client_id: TWITCH_API_CLIENT_ID,
    client_secret: TWITCH_API_CLIENT_SECRET,
    grant_type: 'client_credentials'
  }).toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

  const json = await response.data

  // [TODO] Handle errors here.

  // Save the new token to the database.
  await authorization_key_save(
    'twitch',
    {
      name: 'access_token',
      value: json.access_token,
      expires_at: json.expires_in,
    }
  )
}

/*
 Example json response:
{
  "access_token": "jostpf5q0uzmxmkba9iyug38kjtgh",
  "expires_in": 5011271,
  "token_type": "bearer"
}
*/