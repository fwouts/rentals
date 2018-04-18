import * as types from "./types";

export function validate_VerifyUserRequest(value: any): value is types.VerifyUserRequest {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  if (!validate_VerifyUserRequest_email(value.email)) {
    return false;
  }
  return true;
}

export function validate_VerifyUserRequest_email(value: any): boolean {
  return typeof value === "string";
}

export function validate_ResetDatabase_Response(value: any): value is types.ResetDatabase_Response {
  if (validate_ResetDatabase_Response_0(value)) {
    return true;
  }
  return false;
}

export function validate_ResetDatabase_Response_0(value: any): boolean {
  if (typeof value !== "object" || value === null) {
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

export function validate_VerifyUser_Response(value: any): value is types.VerifyUser_Response {
  if (validate_VerifyUser_Response_0(value)) {
    return true;
  }
  return false;
}

export function validate_VerifyUser_Response_0(value: any): boolean {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  if (!validate_VerifyUser_Response_0_kind(value.kind)) {
    return false;
  }
  return true;
}

export function validate_VerifyUser_Response_0_kind(value: any): boolean {
  return value === "success";
}

export function validate_bool(value: any): value is boolean {
  return typeof value === "boolean";
}

export function validate_int(value: any): value is number {
  return typeof value === "number" && Number.isInteger(value);
}

export function validate_long(value: any): value is number {
  return typeof value === "number" && Number.isInteger(value);
}

export function validate_float(value: any): value is number {
  return typeof value === "number";
}

export function validate_double(value: any): value is number {
  return typeof value === "number";
}

export function validate_string(value: any): value is string {
  return typeof value === "string";
}

export function validate_null(value: any): value is null {
  return value === null;
}
