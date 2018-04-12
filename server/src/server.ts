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
import { getApartment } from "./endpoints/getApartment";
import { getUser } from "./endpoints/getUser";
import { listApartments } from "./endpoints/listApartments";
import { listUsers } from "./endpoints/listUsers";
import { loginUser } from "./endpoints/loginUser";
import { registerUser } from "./endpoints/registerUser";
import { updateApartment } from "./endpoints/updateApartment";
import { updateUser } from "./endpoints/updateUser";
import { verifyEmailAddress } from "./endpoints/verifyEmailAddress";
import * as validation from "./validation";

const PORT = 3010;

const app = express();
app.use(bodyParser.json());
// TODO: Change CORS configuration.
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
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
    const response: api.RegisterUser_Response = await registerUser(
      headers,
      request,
    );
    switch (response.kind) {
      case "success":
        if (!validation.validate_string(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(200);
        res.json(response.data);
        break;
      case "unauthorized":
        if (!validation.validate_string(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(403);
        res.json(response.data);
        break;
      case "failure":
        if (!validation.validate_string(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(409);
        res.json(response.data);
        break;
      default:
        throw new Error(
          `Invalid response: ${JSON.stringify(response, null, 2)}`,
        );
    }
  } catch (err) {
    next(err);
  }
});

app.post("/users/verify", async (req, res, next) => {
  try {
    const request: api.VerifyEmailRequest = req.body;
    if (!validation.validate_VerifyEmailRequest(request)) {
      throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
    }
    const response: api.VerifyEmailAddress_Response = await verifyEmailAddress(
      request,
    );
    switch (response.kind) {
      case "success":
        if (!validation.validate_VerifyEmailResponse(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(200);
        res.json(response.data);
        break;
      case "failure":
        if (!validation.validate_string(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(409);
        res.json(response.data);
        break;
      default:
        throw new Error(
          `Invalid response: ${JSON.stringify(response, null, 2)}`,
        );
    }
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
    const response: api.LoginUser_Response = await loginUser(request);
    switch (response.kind) {
      case "success":
        if (!validation.validate_LoginUserResponse(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(200);
        res.json(response.data);
        break;
      case "failure":
        if (!validation.validate_string(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(401);
        res.json(response.data);
        break;
      default:
        throw new Error(
          `Invalid response: ${JSON.stringify(response, null, 2)}`,
        );
    }
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
    const response: api.CheckAuth_Response = await checkAuth(headers);
    switch (response.kind) {
      case "success":
        if (!validation.validate_LoginUserResponse(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(200);
        res.json(response.data);
        break;
      case "failure":
        if (!validation.validate_string(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(401);
        res.json(response.data);
        break;
      default:
        throw new Error(
          `Invalid response: ${JSON.stringify(response, null, 2)}`,
        );
    }
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
    const response: api.UpdateUser_Response = await updateUser(
      headers,
      id,
      request,
    );
    switch (response.kind) {
      case "success":
        if (!validation.validate_string(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(200);
        res.json(response.data);
        break;
      case "unauthorized":
        if (!validation.validate_string(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(403);
        res.json(response.data);
        break;
      case "failure":
        if (!validation.validate_string(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(409);
        res.json(response.data);
        break;
      case "notfound":
        res.status(404);
        res.end();
        break;
      default:
        throw new Error(
          `Invalid response: ${JSON.stringify(response, null, 2)}`,
        );
    }
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
    const response: api.DeleteUser_Response = await deleteUser(
      headers,
      id,
      request,
    );
    switch (response.kind) {
      case "success":
        if (!validation.validate_string(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(200);
        res.json(response.data);
        break;
      case "unauthorized":
        if (!validation.validate_string(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(403);
        res.json(response.data);
        break;
      case "notfound":
        res.status(404);
        res.end();
        break;
      default:
        throw new Error(
          `Invalid response: ${JSON.stringify(response, null, 2)}`,
        );
    }
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
    const response: api.ListUsers_Response = await listUsers(headers, request);
    switch (response.kind) {
      case "success":
        if (!validation.validate_ListUsersResponse(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(200);
        res.json(response.data);
        break;
      case "unauthorized":
        if (!validation.validate_string(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(403);
        res.json(response.data);
        break;
      default:
        throw new Error(
          `Invalid response: ${JSON.stringify(response, null, 2)}`,
        );
    }
  } catch (err) {
    next(err);
  }
});

app.get("/users/:id", async (req, res, next) => {
  try {
    const headers: api.AuthRequired = {
      Authorization: req.header("Authorization")!,
    };
    if (!validation.validate_AuthRequired(headers)) {
      throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
    }
    const id = req.params.id;
    const response: api.GetUser_Response = await getUser(headers, id);
    switch (response.kind) {
      case "success":
        if (!validation.validate_UserDetails(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(200);
        res.json(response.data);
        break;
      case "unauthorized":
        if (!validation.validate_string(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(403);
        res.json(response.data);
        break;
      case "notfound":
        res.status(404);
        res.end();
        break;
      default:
        throw new Error(
          `Invalid response: ${JSON.stringify(response, null, 2)}`,
        );
    }
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
    const response: api.CreateApartment_Response = await createApartment(
      headers,
      request,
    );
    switch (response.kind) {
      case "success":
        if (!validation.validate_CreateApartmentResponse(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(200);
        res.json(response.data);
        break;
      case "unauthorized":
        if (!validation.validate_string(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(403);
        res.json(response.data);
        break;
      case "failure":
        if (!validation.validate_string(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(409);
        res.json(response.data);
        break;
      default:
        throw new Error(
          `Invalid response: ${JSON.stringify(response, null, 2)}`,
        );
    }
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
    const response: api.UpdateApartment_Response = await updateApartment(
      headers,
      id,
      request,
    );
    switch (response.kind) {
      case "success":
        if (!validation.validate_string(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(200);
        res.json(response.data);
        break;
      case "unauthorized":
        if (!validation.validate_string(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(403);
        res.json(response.data);
        break;
      case "failure":
        if (!validation.validate_string(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(409);
        res.json(response.data);
        break;
      case "notfound":
        res.status(404);
        res.end();
        break;
      default:
        throw new Error(
          `Invalid response: ${JSON.stringify(response, null, 2)}`,
        );
    }
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
    const response: api.DeleteApartment_Response = await deleteApartment(
      headers,
      id,
    );
    switch (response.kind) {
      case "success":
        if (!validation.validate_string(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(200);
        res.json(response.data);
        break;
      case "unauthorized":
        if (!validation.validate_string(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(403);
        res.json(response.data);
        break;
      case "notfound":
        res.status(404);
        res.end();
        break;
      default:
        throw new Error(
          `Invalid response: ${JSON.stringify(response, null, 2)}`,
        );
    }
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
    const response: api.ListApartments_Response = await listApartments(
      headers,
      request,
    );
    switch (response.kind) {
      case "success":
        if (!validation.validate_ListApartmentsResponse(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(200);
        res.json(response.data);
        break;
      case "unauthorized":
        if (!validation.validate_string(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(403);
        res.json(response.data);
        break;
      default:
        throw new Error(
          `Invalid response: ${JSON.stringify(response, null, 2)}`,
        );
    }
  } catch (err) {
    next(err);
  }
});

app.get("/apartments/:id", async (req, res, next) => {
  try {
    const headers: api.AuthRequired = {
      Authorization: req.header("Authorization")!,
    };
    if (!validation.validate_AuthRequired(headers)) {
      throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
    }
    const id = req.params.id;
    const response: api.GetApartment_Response = await getApartment(headers, id);
    switch (response.kind) {
      case "success":
        if (!validation.validate_ApartmentDetails(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(200);
        res.json(response.data);
        break;
      case "unauthorized":
        if (!validation.validate_string(response.data)) {
          throw new Error(
            `Invalid response: ${JSON.stringify(response, null, 2)}`,
          );
        }
        res.status(403);
        res.json(response.data);
        break;
      case "notfound":
        res.status(404);
        res.end();
        break;
      default:
        throw new Error(
          `Invalid response: ${JSON.stringify(response, null, 2)}`,
        );
    }
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
