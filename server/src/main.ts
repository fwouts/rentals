import express from "express";
import { createApartment } from "./endpoints/createApartment";
import { deleteApartment } from "./endpoints/deleteApartment";
import { deleteUser } from "./endpoints/deleteUser";
import { listApartments } from "./endpoints/listApartments";
import { listUsers } from "./endpoints/listUsers";
import { loginUser } from "./endpoints/loginUser";
import { registerUser } from "./endpoints/registerUser";
import { updateApartment } from "./endpoints/updateApartment";
import { updateUser } from "./endpoints/updateUser";

const PORT = 3010;

const app = express();

app.post("/users/register", async (req, res, next) => {
  try {
    const headers: AuthOptional = {
      Authorization: req.header("Authorization"),
    };
    const request: RegisterUserRequest = req.body;
    const response: RegisterUserResponse = await registerUser(headers, request);
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/users/login", async (req, res, next) => {
  try {
    const request: LoginUserRequest = req.body;
    const response: LoginUserResponse = await loginUser(request);
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.put("/users/:id", async (req, res, next) => {
  try {
    const headers: AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    const id = req.params.id;
    const request: UpdateUserRequest = req.body;
    const response: UpdateUserResponse = await updateUser(headers, id, request);
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.delete("/users/:id", async (req, res, next) => {
  try {
    const headers: AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    const id = req.params.id;
    const request: DeleteUserRequest = req.body;
    const response: DeleteUserResponse = await deleteUser(headers, id, request);
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.get("/users", async (req, res, next) => {
  try {
    const headers: AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    const request: ListUsersRequest = req.body;
    const response: ListUsersResponse = await listUsers(headers, request);
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/apartments", async (req, res, next) => {
  try {
    const headers: AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    const request: CreateApartmentRequest = req.body;
    const response: CreateApartmentResponse = await createApartment(
      headers,
      request,
    );
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.put("/apartments/:id", async (req, res, next) => {
  try {
    const headers: AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    const id = req.params.id;
    const request: UpdateApartmentRequest = req.body;
    const response: UpdateApartmentResponse = await updateApartment(
      headers,
      id,
      request,
    );
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.delete("/apartments/:id", async (req, res, next) => {
  try {
    const headers: AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    const id = req.params.id;
    const response: DeleteApartmentResponse = await deleteApartment(
      headers,
      id,
    );
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.get("/apartments", async (req, res, next) => {
  try {
    const headers: AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    const request: ListApartmentsRequest = req.body;
    const response: ListApartmentsResponse = await listApartments(
      headers,
      request,
    );
    res.json(response);
  } catch (err) {
    next(err);
  }
});

// tslint:disable-next-line no-console
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

export interface AuthOptional {
  Authorization?: string;
}

export interface AuthRequired {
  Authorization: string;
}

export interface RegisterUserRequest {
  email: string;
  password: string;
  role: Role;
}

export interface RegisterUserResponse {
  status: "success" | "error";
  message: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export type LoginUserResponse =
  | {
      status: "error";
      message: string;
    }
  | {
      status: "success";
      jwtToken: string;
      role: Role;
    };

export interface UpdateUserRequest {
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface UpdateUserResponse {
  status: "success" | "error";
  message: string;
}

export interface DeleteUserRequest {
  password?: string;
}

export interface DeleteUserResponse {
  status: "success" | "error";
  message: string;
}

export interface ListUsersRequest {
  filter?: {
    role: Role;
  };
  pageToken?: string;
}

export interface ListUsersResponse {
  results: UserDetails[];
  totalResults: number;
  nextPageToken?: string;
}

export interface UserDetails {
  id: string;
  email: string;
  role: Role;
}

export type Role = "client" | "realtor" | "admin";

export interface CreateApartmentRequest {
  info: ApartmentInfo;
  realtorId?: string;
}

export interface CreateApartmentResponse {
  status: "success" | "error";
  message: string;
}

export interface UpdateApartmentRequest {
  info: ApartmentInfo;
}

export interface UpdateApartmentResponse {
  status: "success" | "error";
  message: string;
}

export interface DeleteApartmentResponse {
  status: "success" | "error";
  message: string;
}

export interface ListApartmentsRequest {
  filter?: {
    rented?: boolean;
    sizeRange?: {
      min: number;
      max: number;
    };
    priceRange?: {
      min: number;
      max: number;
    };
    numberOfRooms?: {
      min: number;
      max: number;
    };
  };
  pageToken?: string;
}

export interface ListApartmentsResponse {
  results: ApartmentDetails[];
  totalResults: number;
  nextPageToken?: string;
}

export interface ApartmentDetails {
  info: ApartmentInfo;
  realtor: Realtor;
  dateAdded: Date;
}

export interface ApartmentInfo {
  id: string;
  floorArea: number;
  pricePerMonth: number;
  numberOfRooms: number;
  coordinates: Coordinates;
  rented: boolean;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type Date = number;

export interface Realtor {
  id: string;
  name: string;
}
