export function bodyParse(body: string | undefined) {
  return JSON.parse(body || '{}');
}
