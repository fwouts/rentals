import { Role } from "../api/types";

export function humanizeRole(role: Role, forSentence = false) {
  if (forSentence) {
    switch (role) {
      case "client":
        return "a client";
      case "realtor":
        return "a realtor";
      case "admin":
        return "an admin";
      default:
        return "?";
    }
  } else {
    switch (role) {
      case "client":
        return "Client";
      case "realtor":
        return "Realtor";
      case "admin":
        return "Admin";
      default:
        return "?";
    }
  }
}
