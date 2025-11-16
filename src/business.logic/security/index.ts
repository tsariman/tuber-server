import bcrypt from 'bcrypt'
import Config from '../../config'
// import { randomBytes } from 'crypto'

export async function get_hashed_password(password?: string) {
  if (password) {
    return await bcrypt.hash(password, Config.PWD_SALT_ROUNDS)
  }
  return ''
}

export async function check_password(password: string, hash: string) {
  return await bcrypt.compare(password, hash)
}

/** Global variable to store the current bootstrap prefix */
let BOOTSTRAP_PREFIX: string

/** Generate a random prefix for the bootstrap route per session. */
export function get_bootstrap_key(): string {
  return BOOTSTRAP_PREFIX || (
    BOOTSTRAP_PREFIX = '3dad18f2d7bf2214a082c735880bcde9' // randomBytes(16).toString('hex')
  )
}

export function get_server_domain(): string {
  return Config.DOMAIN
}

export function get_client_domain(): string {
  return Config.CLIENT_DOMAIN
}