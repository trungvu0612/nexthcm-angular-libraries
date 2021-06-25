// TODO: remove when rx-angular publishing new version

export function isKeyOf<O>(k: unknown): k is keyof O {
  return !!k && (typeof k === 'string' || typeof k === 'symbol' || typeof k === 'number');
}

export function isObjectGuard(obj: unknown): obj is object {
  return !!obj && typeof obj === 'object' && !Array.isArray(obj);
}

export function isDefined(val: unknown): val is NonNullable<any> {
  return val !== null && val !== undefined;
}

export function slice<T extends object, K extends keyof T>(object: T, keys: K | K[]): Pick<T, K> {
  const objectIsObject = isDefined(object) && isObjectGuard(object);

  if (!objectIsObject) {
    console.warn(`slice: original value (${object}) is not an object.`);
    return undefined as any;
  }

  const sanitizedKeys = (Array.isArray(keys) ? keys : [keys]).filter((k) => isKeyOf<T>(k) && k in object);

  if (!sanitizedKeys.length) {
    console.warn(`slice: provided keys not found`);
    return undefined as any;
  }

  return sanitizedKeys.reduce((acc, k) => ({ ...acc, [k]: object[k] }), {} as Pick<T, K>);
}
