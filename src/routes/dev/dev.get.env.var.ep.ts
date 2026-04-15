import { FastifyReply, FastifyRequest } from 'fastify'
import { ler, log_err, task } from '../../utility/logging'
import { error_id } from '../../business.logic/errors'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
import { IQueryEnvVar } from '../../common.types'

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
    process.stdout.write('\n --------------------------------- \n')
    process.stdout.write('\n |     ENVIRONMENT VARIABLES     | \n')
    process.stdout.write('\n --------------------------------- \n')
    console.log('\n')
    task('Fetching environment variable(s) ')
    const variable = req.query.var
    if (variable) {
      task.end('[✔️]')
      console.log(`${variable} =`, process.env[variable])
      reply.code(200).send(JsonapiResponseBuilder.forSingleResource<typeof process.env>()
        .addAttribute(variable, process.env[variable])
        .build()
      )
    } else {
      task.end('[✔️]')
      console.log(process.env)
    }
    console.log('\n')
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[50017]'))
    log_err('[50017] DEV GET ENV VAR ERROR', e)
    reply.code(500).send(error_id(50017).default_500_error_response(e))
  }
}