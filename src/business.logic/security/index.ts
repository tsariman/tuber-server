
import bcrypt from 'bcrypt'
import Config from '../../config'

export async function get_hashed_password(password?: string) {
  if (password) {
    return await bcrypt.hash(password, Config.PWD_SALT_ROUNDS)
  }
  return ''
}

export async function check_password(password: string, hash: string) {
  return await bcrypt.compare(password, hash)
}