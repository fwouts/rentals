import "module-alias/register";

import { initDatabase } from "@/db";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import * as api from "./api";
import { checkAuth } from "./endpoints/checkAuth";
import { createApartment } from "./endpoints/createApartment";
import { deleteApartment } from "./endpoints/deleteApartment";
import { deleteUser } from "./endpoints/deleteUser";
import { listApartments } from "./endpoints/listApartments";
import { listUsers } from "./endpoints/listUsers";
import { loginUser } from "./endpoints/loginUser";
import { registerUser } from "./endpoints/registerUser";
import { updateApartment } from "./endpoints/updateApartment";
import { updateUser } from "./endpoints/updateUser";
import * as validation from "./validation";

const PORT = 3010;

const app = express();
app.use(bodyParser.json());
// TODO: Change CORS configuration.
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        origin === "http://localhost" ||
        origin.startsWith("http://localhost:")
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Access is not allowed from ${origin}.`));
      }
    },
  }),
);

app.post("/users/register", async (req, res, next) => {
  try {
    const headers: api.AuthOptional = {
      Authorization: req.header("Authorization"),
    };
    if (!validation.validate_AuthOptional(headers)) {
      throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
    }
    const request: api.RegisterUserRequest = req.body;
    if (!validation.validate_RegisterUserRequest(request)) {
      throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
    }
    const response: api.RegisterUserResponse = await registerUser(
      headers,
      request,
    );
    if (!validation.validate_RegisterUserResponse(response)) {
      throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/users/login", async (req, res, next) => {
  try {
    const request: api.LoginUserRequest = req.body;
    if (!validation.validate_LoginUserRequest(request)) {
      throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
    }
    const response: api.LoginUserResponse = await loginUser(request);
    if (!validation.validate_LoginUserResponse(response)) {
      throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/users/auth", async (req, res, next) => {
  try {
    const headers: api.AuthRequired = {
      Authorization: req.header("Authorization")!,
    };
    if (!validation.validate_AuthRequired(headers)) {
      throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
    }
    const response: api.LoginUserResponse = await checkAuth(headers);
    if (!validation.validate_LoginUserResponse(response)) {
      throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.put("/users/:id", async (req, res, next) => {
  try {
    const headers: api.AuthRequired = {
      Authorization: req.header("Authorization")!,
    };
    if (!validation.validate_AuthRequired(headers)) {
      throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
    }
    const id = req.params.id;
    const request: api.UpdateUserRequest = req.body;
    if (!validation.validate_UpdateUserRequest(request)) {
      throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
    }
    const response: api.UpdateUserResponse = await updateUser(
      headers,
      id,
      request,
    );
    if (!validation.validate_UpdateUserResponse(response)) {
      throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.delete("/users/:id", async (req, res, next) => {
  try {
    const headers: api.AuthRequired = {
      Authorization: req.header("Authorization")!,
    };
    if (!validation.validate_AuthRequired(headers)) {
      throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
    }
    const id = req.params.id;
    const request: api.DeleteUserRequest = req.body;
    if (!validation.validate_DeleteUserRequest(request)) {
      throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
    }
    const response: api.DeleteUserResponse = await deleteUser(
      headers,
      id,
      request,
    );
    if (!validation.validate_DeleteUserResponse(response)) {
      throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/users/list", async (req, res, next) => {
  try {
    const headers: api.AuthRequired = {
      Authorization: req.header("Authorization")!,
    };
    if (!validation.validate_AuthRequired(headers)) {
      throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
    }
    const request: api.ListUsersRequest = req.body;
    if (!validation.validate_ListUsersRequest(request)) {
      throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
    }
    const response: api.ListUsersResponse = await listUsers(headers, request);
    if (!validation.validate_ListUsersResponse(response)) {
      throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/apartments/create", async (req, res, next) => {
  try {
    const headers: api.AuthRequired = {
      Authorization: req.header("Authorization")!,
    };
    if (!validation.validate_AuthRequired(headers)) {
      throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
    }
    const request: api.CreateApartmentRequest = req.body;
    if (!validation.validate_CreateApartmentRequest(request)) {
      throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
    }
    const response: api.CreateApartmentResponse = await createApartment(
      headers,
      request,
    );
    if (!validation.validate_CreateApartmentResponse(response)) {
      throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.put("/apartments/:id", async (req, res, next) => {
  try {
    const headers: api.AuthRequired = {
      Authorization: req.header("Authorization")!,
    };
    if (!validation.validate_AuthRequired(headers)) {
      throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
    }
    const id = req.params.id;
    const request: api.UpdateApartmentRequest = req.body;
    if (!validation.validate_UpdateApartmentRequest(request)) {
      throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
    }
    const response: api.UpdateApartmentResponse = await updateApartment(
      headers,
      id,
      request,
    );
    if (!validation.validate_UpdateApartmentResponse(response)) {
      throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.delete("/apartments/:id", async (req, res, next) => {
  try {
    const headers: api.AuthRequired = {
      Authorization: req.header("Authorization")!,
    };
    if (!validation.validate_AuthRequired(headers)) {
      throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
    }
    const id = req.params.id;
    const response: api.DeleteApartmentResponse = await deleteApartment(
      headers,
      id,
    );
    if (!validation.validate_DeleteApartmentResponse(response)) {
      throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/apartments/list", async (req, res, next) => {
  try {
    const headers: api.AuthRequired = {
      Authorization: req.header("Authorization")!,
    };
    if (!validation.validate_AuthRequired(headers)) {
      throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
    }
    const request: api.ListApartmentsRequest = req.body;
    if (!validation.validate_ListApartmentsRequest(request)) {
      throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
    }
    const response: api.ListApartmentsResponse = await listApartments(
      headers,
      request,
    );
    if (!validation.validate_ListApartmentsResponse(response)) {
      throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
    res.json(response);
  } catch (err) {
    next(err);
  }
});

if (require.main === module) {
  initDatabase().catch((e) => {
    // tslint:disable-next-line no-console
    console.error(e);
    process.exit(1);
  });
  // tslint:disable-next-line no-console
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}
