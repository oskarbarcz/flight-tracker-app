export default function getFormData<T>(form: FormData, keys: (keyof T)[]): T {
  const data: Partial<Record<keyof T, string | number>> = {};

  for (const key of keys) {
    const value = form.get(key as string);
    if (typeof value === "string") {
      data[key] = value;
    }
  }

  return data as T;
}
