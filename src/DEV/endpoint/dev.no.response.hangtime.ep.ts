import { FastifyReply, FastifyRequest } from 'fastify'
import { ms_to_seconds } from '../../business.logic'
import C from '../../config'

type TDevHandRequest = FastifyRequest<{
  Params: {
    hangTime: string
  }
}>

export default async function dev_no_response_hangtime (
  request: TDevHandRequest,
  _reply: FastifyReply
) {
  const hangTime = parseInt(request.params.hangTime) || 5000
  C.log('Hanging endpoint called for', ms_to_seconds(hangTime))
  let loopForever = true
  setTimeout(() => {
    loopForever = false
  }, hangTime)
  while (loopForever) {
    await new Promise(resolve => setTimeout(resolve, hangTime))
  }
}
