export function camelToSnakeCase(str: string) {
  return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}
