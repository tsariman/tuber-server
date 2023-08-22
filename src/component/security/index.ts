
import bcrypt from 'bcrypt'
import Config from 'src/config'

export async function get_hashed_password(password: string) {
  return await bcrypt.hash(password, Config.PWD_SALT_ROUNDS)
}

export async function check_password(password: string, hash: string) {
  return await bcrypt.compare(password, hash)
}