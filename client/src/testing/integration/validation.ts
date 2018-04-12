export function validate_ResetDatabase_Response(value: any): boolean {
  if (validate_ResetDatabase_Response_0(value)) {
    return true;
  }
  return false;
}

export function validate_ResetDatabase_Response_0(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_ResetDatabase_Response_0_kind(value.kind)) {
    return false;
  }
  return true;
}

export function validate_ResetDatabase_Response_0_kind(value: any): boolean {
  return value === "success";
}

export function validate_bool(value: any): boolean {
  return typeof value === "boolean";
}

export function validate_int(value: any): boolean {
  return typeof value === "number" && Number.isInteger(value);
}

export function validate_long(value: any): boolean {
  return typeof value === "number" && Number.isInteger(value);
}

export function validate_float(value: any): boolean {
  return typeof value === "number";
}

export function validate_double(value: any): boolean {
  return typeof value === "number";
}

export function validate_string(value: any): boolean {
  return typeof value === "string";
}

export function validate_null(value: any): boolean {
  return value === null;
}
