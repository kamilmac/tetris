const values: Record<string, unknown> = {};

const set = (key: string, value: unknown) => {
  values[key] = value;
};

const get = (key: string) => {
  return values[key];
};

export const Bridge = {
  set,
  get,
};
