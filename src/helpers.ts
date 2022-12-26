export const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
