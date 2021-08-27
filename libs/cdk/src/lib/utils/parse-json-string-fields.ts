export function parseJsonStringFields<T extends Record<string, any>>(obj: T, props: string[] = []): T {
  obj = { ...obj };

  props.forEach((prop) => {
    if (prop in obj && obj[prop]) {
      obj[prop as keyof T] = JSON.parse(obj[prop]);
    }
  });

  return obj;
}
