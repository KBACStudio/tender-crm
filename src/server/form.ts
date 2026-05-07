export function optionalString(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length ? value : null;
}

export function requiredString(formData: FormData, key: string) {
  const value = optionalString(formData, key);
  if (!value) throw new Error(`Campo obbligatorio: ${key}`);
  return value;
}

export function optionalDate(formData: FormData, key: string) {
  const value = optionalString(formData, key);
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

export function optionalDecimal(formData: FormData, key: string) {
  const value = optionalString(formData, key);
  return value ? value.replace(",", ".") : null;
}

export function optionalBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}
