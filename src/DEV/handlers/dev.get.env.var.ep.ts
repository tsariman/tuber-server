import { FastifyReply, FastifyRequest } from 'fastify';
import { log } from '../../utility/logging';
import { default_500_error_response } from '../../business.logic/errors';
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared';
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder';
import { IQueryEnvVar } from '../../common.types';

/**
 * Get environment variable(s) value
 * 
 * e.g.
 *
 * `GET /dev/environment-variable?var=<variable-name>`
 */
export default function dev_get_env_var_enpoint (
  req: FastifyRequest<IQueryEnvVar>,
  reply: FastifyReply
) {
  try {
    process.stdout.write('\n --------------------------------- \n');
    process.stdout.write('\n |     ENVIRONMENT VARIABLES     | \n');
    process.stdout.write('\n --------------------------------- \n');
    console.log('\n');
    const variable = req.query.var;
    if (variable) {
      console.log(`${variable} =`, process.env[variable]);
      reply.code(200).send(JsonapiResponseBuilder.forSingleResource<typeof process.env>()
        .addAttribute(variable, process.env[variable])
        .build()
      );
    } else {
      console.log(process.env);
    }
    console.log('\n');
  } catch (e) {
    log(MSG_500_ERROR_MESSAGE, e);
    reply.code(500).send(default_500_error_response(e));
  }
}