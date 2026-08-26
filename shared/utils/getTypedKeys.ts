// Like Object.keys(), but returns the keys typed as keyof T instead of string[].
export function getTypedKeys<T extends Record<string, unknown>>(obj: T): [keyof T, ...(keyof T)[]] {
  return Object.keys(obj) as [keyof T, ...(keyof T)[]]
}
