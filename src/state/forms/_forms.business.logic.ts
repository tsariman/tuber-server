import Config from "../../config"

export function remove_form_suffix(_key?: string) {
  if (_key) {
    return _key.replace('Form', '')
  }
  Config.die('formState._key not defined.')
  return ''
}
