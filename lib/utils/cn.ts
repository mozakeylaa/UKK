type ClassValue =
  | string
  | number
  | null
  | boolean
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>;

function flatten(inputs: ClassValue[]): string[] {
  const out: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string" || typeof input === "number") {
      out.push(String(input));
    } else if (Array.isArray(input)) {
      out.push(...flatten(input));
    } else if (typeof input === "object") {
      for (const key in input) {
        if (input[key]) out.push(key);
      }
    }
  }
  return out;
}

export function cn(...inputs: ClassValue[]): string {
  return flatten(inputs).join(" ");
}