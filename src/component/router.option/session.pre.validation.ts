import { RouteShorthandOptions } from 'fastify'

const session_pre_validation: RouteShorthandOptions['preValidation'] = async function (
  _request, _reply, done
) {
  done()
}

export default session_pre_validation