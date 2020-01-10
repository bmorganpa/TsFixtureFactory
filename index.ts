const factorySymbol = Symbol("Unique identifier for fixture factories");

export type OrFixtureFactory<T> = {
  [P in keyof T]: T[P] | FixtureFactory<T[P]>;
};

export interface FixtureFactory<T> {
  (...values: Array<Partial<OrFixtureFactory<T>>>): T;
}

export function createFixtureFactory<T>(
  defaultValues?: OrFixtureFactory<T>
): FixtureFactory<T>;
export function createFixtureFactory<T>(
  defaultValues: Partial<OrFixtureFactory<T>>,
  parent: FixtureFactory<T>
): FixtureFactory<T>;
export function createFixtureFactory<T>(
  defaultValues: Partial<OrFixtureFactory<T>> = {},
  parent?: FixtureFactory<T>
): FixtureFactory<T> {
  const factory: FixtureFactory<T> = (
      ...overrides: Array<Partial<OrFixtureFactory<T>>>
    ) => {
        const resolvedDefaults = resolveFactories(defaultValues);
        return Object.assign(
              {},
              !!parent ? parent(resolvedDefaults) : resolvedDefaults,
              ...overrides
            );
      };
  factory[factorySymbol] = true;
  return factory;
}

function resolveFactories<T>(
  unresolvedObject: Partial<OrFixtureFactory<T>>
): Partial<T> {
  let resolvedObject: Partial<T> = {};
  for (const key in unresolvedObject) {
      const value = unresolvedObject[key];
      resolvedObject[key] = resolveFactory<T[Extract<keyof T, string>]>(value);
    }
  return resolvedObject;
}

function resolveFactory<T>(value?: T | FixtureFactory<T>): T | undefined {
  if (!value) {
    return undefined;
  }
  return instanceOfFixtureFactory<T>(value) ? value() : value;
}

function instanceOfFixtureFactory<T>(object: any): object is FixtureFactory<T> {
  return Object.getOwnPropertySymbols(object).includes(factorySymbol);
}

