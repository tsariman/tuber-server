import { RouteShorthandOptions } from 'fastify';

const pre_validation_session: RouteShorthandOptions['preValidation'] = async function (
  _request, _reply, done
) {

  done();
}

export default pre_validation_session;