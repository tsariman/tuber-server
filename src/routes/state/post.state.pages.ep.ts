import { FastifyReply, FastifyRequest } from 'fastify'
import { dbug, log_err, task, ler } from '../../utility/logging'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import  { STATE_PAGES, STATE_PAGES_THEME_DARK } from '../../state/page'
import { MSG_500_ERROR_MESSAGE, type TJsonapiStateResponse } from '@tuber/shared'
import type { IStatePost } from '../../common.types'
import { themed } from '../../business.logic'
import { normalize_key } from '../../utility'

/** `POST /state/pages` endpoint handler */
export default async function post_state_pages_endpoint (
  req: FastifyRequest<IStatePost>,
  reply: FastifyReply
) {
  const { key, theme_mode: themeMode } = req.body
  try {
    dbug(`Received request to load page state for key '${key}' with theme mode '${themeMode}'.`)
    task('Validating request body ')
    if (!key || !themeMode) {
      task.end('[❌]')
      dbug('[400] Malformed request received.', req.body)
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MALFORMED_REQUEST')
        .withTitle('Malformed request received.')
        .withDetail('Both \'key\' and \'theme_mode\' are required in the request body.')
        .build())
      return
    }
    task.end('[✔️]')
    task(`Loading page '${key}' state with theme mode '${themeMode}' `)

    // TODO Move to business logic and optimize by caching the normalized key
    const normalizedKey = normalize_key(key)
    const light = STATE_PAGES[normalizedKey]
    const dark = STATE_PAGES_THEME_DARK[normalizedKey]
    const pageState = themed(light, dark, themeMode)
    // ------------------------------------------------------------------------
  
    if (pageState) {
      task.end('[✔️]')
      reply.code(200).send({
        'state': {
          'pages': { [normalizedKey]: pageState },
          'pagesLight': { [normalizedKey]: STATE_PAGES[normalizedKey] },
          'pagesDark': {
            [normalizedKey]: STATE_PAGES_THEME_DARK[normalizedKey]
          },
        }
      } as TJsonapiStateResponse)
    } else {
      task.end('[❌]')
      dbug(`[404] Page state for key '${key}' not found.`)
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('MISSING_STATE')
        .withTitle('Page state not found.')
        .withDetail(`No page state found for key '${key}'.`)
        .withState({
          'pages': {
            [normalizedKey]: {
              'appbarInherited': 'default-notfound',
              'contentInherited': 'default-notfound',
              'layout': 'layout_centered',
              'data': { 'message': `Page not found!` },
            }
          }
        })
        .build())
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[5040]'))
    log_err('[5040] POST state pages', e)
    reply.code(500).send(error_id(5040).default_500_error_response(e))
  }
}