import Config from "../../config"

export function remove_form_suffix(_key?: string) {
  if (!_key) {
    Config.die('formState._key not defined.')
    return ''
  }
  return _key.slice(-4) === 'Form'
    ? _key.replace('Form', '')
    : _key
}
