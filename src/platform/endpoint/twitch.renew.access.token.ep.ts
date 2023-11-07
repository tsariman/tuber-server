import { FastifyReply, FastifyRequest } from 'fastify'
import C from '../../config'
import { authorization_save } from 'src/model/Authorization'

/**
 * Endpoint is meant to be called by the server to renew the access token.
 */
export default async function twitch_renew_access_token_enpoint(
  _req: FastifyRequest,
  _reply: FastifyReply
) {
  // [TODO] Twitch access token expires every 60 days. Renew it here.
  const response = await fetch(C.TWITCH_API_TOKEN_REQUEST_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: C.TWITCH_API_CLIENT_ID,
      client_secret: C.TWITCH_API_CLIENT_SECRET,
      grant_type: 'client_credentials'
    }).toString()
  })
  const json = await response.json()

  // [TODO] Handle errors here.

  // [TODO] Save the new token to the database.
  await authorization_save(
    'twitch',
    {
      name: 'access_token',
      value: json.access_token,
      expires_in: json.expires_in,
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