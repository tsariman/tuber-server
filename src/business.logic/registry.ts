
const STATE_REGISTRY: Record<string, unknown> = {}

/**
 * Populate the registry with the given key and value pair. The registry is
 * used to hotwire the state and dialog keys to their respective components,
 * allowing for dynamic rendering and state management.
 * @param type The type of the registry, currently only 'state' is supported.
 * @param id The unique identifier for the state or dialog.
 * @param key The key to be stored in the registry, typically a constant
 *            representing the state or dialog key.
 */
export const register = function <T=unknown>(
  type:'state',
  id: string,
  key: T
): void {
  switch (type) {
  case 'state':
    STATE_REGISTRY[id] = key
    return
  }
}

export const get_registry = function (type:'state'): Record<string, unknown> {
  switch (type) {
  case 'state':
    return STATE_REGISTRY
  }
}