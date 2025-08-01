
/** Randomly return the value stored in the properties of an object. */
export const random_property = <T=unknown>(obj: Record<string, T>): T => {
  const keys = Object.keys(obj);
  return obj[keys[keys.length * Math.random() << 0]];
};
