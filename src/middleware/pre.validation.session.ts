import { RouteShorthandOptions } from 'fastify';

const pre_validation_session: RouteShorthandOptions['preValidation'] = async function (
  request,
  reply,
  done
) {
  void request;
  void reply;
  done();
}

export default pre_validation_session;