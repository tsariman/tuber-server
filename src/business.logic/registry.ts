
const STATE_REGISTRY: Record<string, unknown> = {};

export const register = function <T=unknown>(
  type:'state',
  id: string,
  key: T
): void {
  switch (type) {
  case 'state':
    STATE_REGISTRY[id] = key
    return;
  }
};

export const get_registry = function (type:'state'): Record<string, unknown> {
  switch (type) {
  case 'state':
    return STATE_REGISTRY;
  }
};