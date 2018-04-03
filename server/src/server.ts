import express from "express";
import * as api from "./api";
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
    const headers: api.AuthOptional = {
      Authorization: req.header("Authorization"),
    };
    const request: api.RegisterUserRequest = req.body;
    const response: api.RegisterUserResponse = await registerUser(
      headers,
      request,
    );
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/users/login", async (req, res, next) => {
  try {
    const request: api.LoginUserRequest = req.body;
    const response: api.LoginUserResponse = await loginUser(request);
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.put("/users/:id", async (req, res, next) => {
  try {
    const headers: api.AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    const id = req.params.id;
    const request: api.UpdateUserRequest = req.body;
    const response: api.UpdateUserResponse = await updateUser(
      headers,
      id,
      request,
    );
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.delete("/users/:id", async (req, res, next) => {
  try {
    const headers: api.AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    const id = req.params.id;
    const request: api.DeleteUserRequest = req.body;
    const response: api.DeleteUserResponse = await deleteUser(
      headers,
      id,
      request,
    );
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.get("/users", async (req, res, next) => {
  try {
    const headers: api.AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    const request: api.ListUsersRequest = req.body;
    const response: api.ListUsersResponse = await listUsers(headers, request);
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/apartments", async (req, res, next) => {
  try {
    const headers: api.AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    const request: api.CreateApartmentRequest = req.body;
    const response: api.CreateApartmentResponse = await createApartment(
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
    const headers: api.AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    const id = req.params.id;
    const request: api.UpdateApartmentRequest = req.body;
    const response: api.UpdateApartmentResponse = await updateApartment(
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
    const headers: api.AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    const id = req.params.id;
    const response: api.DeleteApartmentResponse = await deleteApartment(
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
    const headers: api.AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    const request: api.ListApartmentsRequest = req.body;
    const response: api.ListApartmentsResponse = await listApartments(
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
