import "module-alias/register";

import { initDatabase } from "@/db";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import * as types from "./api/types";
import * as validators from "./api/validators";

// start-generated-section endpointImports
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
// end-generated-section endpointImports

const PORT = 3010;

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
      // If you want to only allow some origins, use the following instead:
      // callback(new Error(`Access is not allowed from ${origin}.`));
    },
  }),
);

// start-generated-section httpHooks
app.post("/users/register", async (req, res, next) => {
  try {
    const headers: types.AuthOptional = {
      Authorization: req.header("Authorization"),
    };
    if (!validators.validate_AuthOptional(headers)) {
      throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
    }
    const request: types.RegisterUserRequest = req.body;
    if (!validators.validate_RegisterUserRequest(request)) {
      throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
    }
    const response: types.RegisterUser_Response = await registerUser(headers, request);
    switch (response.kind) {
      case "success":
        if (!validators.validate_string(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(200);
        res.json(response.data);
        break;
      case "unauthorized":
        if (!validators.validate_string(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(403);
        res.json(response.data);
        break;
      case "failure":
        if (!validators.validate_string(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(409);
        res.json(response.data);
        break;
      default:
        throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
  } catch (err) {
    next(err);
  }
});

app.post("/users/verify", async (req, res, next) => {
  try {
    const request: types.VerifyEmailRequest = req.body;
    if (!validators.validate_VerifyEmailRequest(request)) {
      throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
    }
    const response: types.VerifyEmailAddress_Response = await verifyEmailAddress(request);
    switch (response.kind) {
      case "success":
        if (!validators.validate_VerifyEmailResponse(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(200);
        res.json(response.data);
        break;
      case "failure":
        if (!validators.validate_string(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(409);
        res.json(response.data);
        break;
      default:
        throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
  } catch (err) {
    next(err);
  }
});

app.post("/users/login", async (req, res, next) => {
  try {
    const request: types.LoginUserRequest = req.body;
    if (!validators.validate_LoginUserRequest(request)) {
      throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
    }
    const response: types.LoginUser_Response = await loginUser(request);
    switch (response.kind) {
      case "success":
        if (!validators.validate_LoginUserResponse(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(200);
        res.json(response.data);
        break;
      case "failure":
        if (!validators.validate_string(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(401);
        res.json(response.data);
        break;
      default:
        throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
  } catch (err) {
    next(err);
  }
});

app.post("/users/auth", async (req, res, next) => {
  try {
    const headers: types.AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    if (!validators.validate_AuthRequired(headers)) {
      throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
    }
    const response: types.CheckAuth_Response = await checkAuth(headers);
    switch (response.kind) {
      case "success":
        if (!validators.validate_LoginUserResponse(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(200);
        res.json(response.data);
        break;
      case "failure":
        if (!validators.validate_string(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(401);
        res.json(response.data);
        break;
      default:
        throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
  } catch (err) {
    next(err);
  }
});

app.put("/users/:id", async (req, res, next) => {
  try {
    const headers: types.AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    if (!validators.validate_AuthRequired(headers)) {
      throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
    }
    const id = req.params.id;
    const request: types.UpdateUserRequest = req.body;
    if (!validators.validate_UpdateUserRequest(request)) {
      throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
    }
    const response: types.UpdateUser_Response = await updateUser(headers, id, request);
    switch (response.kind) {
      case "success":
        if (!validators.validate_string(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(200);
        res.json(response.data);
        break;
      case "unauthorized":
        if (!validators.validate_string(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(403);
        res.json(response.data);
        break;
      case "failure":
        if (!validators.validate_string(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(409);
        res.json(response.data);
        break;
      case "notfound":
        res.status(404);
        res.end();
        break;
      default:
        throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
  } catch (err) {
    next(err);
  }
});

app.delete("/users/:id", async (req, res, next) => {
  try {
    const headers: types.AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    if (!validators.validate_AuthRequired(headers)) {
      throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
    }
    const id = req.params.id;
    const request: types.DeleteUserRequest = req.body;
    if (!validators.validate_DeleteUserRequest(request)) {
      throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
    }
    const response: types.DeleteUser_Response = await deleteUser(headers, id, request);
    switch (response.kind) {
      case "success":
        if (!validators.validate_string(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(200);
        res.json(response.data);
        break;
      case "unauthorized":
        if (!validators.validate_string(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(403);
        res.json(response.data);
        break;
      case "notfound":
        res.status(404);
        res.end();
        break;
      default:
        throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
  } catch (err) {
    next(err);
  }
});

app.post("/users/list", async (req, res, next) => {
  try {
    const headers: types.AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    if (!validators.validate_AuthRequired(headers)) {
      throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
    }
    const request: types.ListUsersRequest = req.body;
    if (!validators.validate_ListUsersRequest(request)) {
      throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
    }
    const response: types.ListUsers_Response = await listUsers(headers, request);
    switch (response.kind) {
      case "success":
        if (!validators.validate_ListUsersResponse(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(200);
        res.json(response.data);
        break;
      case "unauthorized":
        if (!validators.validate_string(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(403);
        res.json(response.data);
        break;
      default:
        throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
  } catch (err) {
    next(err);
  }
});

app.get("/users/:id", async (req, res, next) => {
  try {
    const headers: types.AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    if (!validators.validate_AuthRequired(headers)) {
      throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
    }
    const id = req.params.id;
    const response: types.GetUser_Response = await getUser(headers, id);
    switch (response.kind) {
      case "success":
        if (!validators.validate_UserDetails(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(200);
        res.json(response.data);
        break;
      case "unauthorized":
        if (!validators.validate_string(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(403);
        res.json(response.data);
        break;
      case "notfound":
        res.status(404);
        res.end();
        break;
      default:
        throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
  } catch (err) {
    next(err);
  }
});

app.post("/apartments/create", async (req, res, next) => {
  try {
    const headers: types.AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    if (!validators.validate_AuthRequired(headers)) {
      throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
    }
    const request: types.CreateApartmentRequest = req.body;
    if (!validators.validate_CreateApartmentRequest(request)) {
      throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
    }
    const response: types.CreateApartment_Response = await createApartment(headers, request);
    switch (response.kind) {
      case "success":
        if (!validators.validate_CreateApartmentResponse(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(200);
        res.json(response.data);
        break;
      case "unauthorized":
        if (!validators.validate_string(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(403);
        res.json(response.data);
        break;
      case "failure":
        if (!validators.validate_string(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(409);
        res.json(response.data);
        break;
      default:
        throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
  } catch (err) {
    next(err);
  }
});

app.put("/apartments/:id", async (req, res, next) => {
  try {
    const headers: types.AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    if (!validators.validate_AuthRequired(headers)) {
      throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
    }
    const id = req.params.id;
    const request: types.UpdateApartmentRequest = req.body;
    if (!validators.validate_UpdateApartmentRequest(request)) {
      throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
    }
    const response: types.UpdateApartment_Response = await updateApartment(headers, id, request);
    switch (response.kind) {
      case "success":
        if (!validators.validate_string(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(200);
        res.json(response.data);
        break;
      case "unauthorized":
        if (!validators.validate_string(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(403);
        res.json(response.data);
        break;
      case "failure":
        if (!validators.validate_string(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(409);
        res.json(response.data);
        break;
      case "notfound":
        res.status(404);
        res.end();
        break;
      default:
        throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
  } catch (err) {
    next(err);
  }
});

app.delete("/apartments/:id", async (req, res, next) => {
  try {
    const headers: types.AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    if (!validators.validate_AuthRequired(headers)) {
      throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
    }
    const id = req.params.id;
    const response: types.DeleteApartment_Response = await deleteApartment(headers, id);
    switch (response.kind) {
      case "success":
        if (!validators.validate_string(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(200);
        res.json(response.data);
        break;
      case "unauthorized":
        if (!validators.validate_string(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(403);
        res.json(response.data);
        break;
      case "notfound":
        res.status(404);
        res.end();
        break;
      default:
        throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
  } catch (err) {
    next(err);
  }
});

app.post("/apartments/list", async (req, res, next) => {
  try {
    const headers: types.AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    if (!validators.validate_AuthRequired(headers)) {
      throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
    }
    const request: types.ListApartmentsRequest = req.body;
    if (!validators.validate_ListApartmentsRequest(request)) {
      throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
    }
    const response: types.ListApartments_Response = await listApartments(headers, request);
    switch (response.kind) {
      case "success":
        if (!validators.validate_ListApartmentsResponse(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(200);
        res.json(response.data);
        break;
      case "unauthorized":
        if (!validators.validate_string(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(403);
        res.json(response.data);
        break;
      default:
        throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
  } catch (err) {
    next(err);
  }
});

app.get("/apartments/:id", async (req, res, next) => {
  try {
    const headers: types.AuthRequired = {
      Authorization: req.header("Authorization") || "",
    };
    if (!validators.validate_AuthRequired(headers)) {
      throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
    }
    const id = req.params.id;
    const response: types.GetApartment_Response = await getApartment(headers, id);
    switch (response.kind) {
      case "success":
        if (!validators.validate_ApartmentDetails(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(200);
        res.json(response.data);
        break;
      case "unauthorized":
        if (!validators.validate_string(response.data)) {
          throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
        }
        res.status(403);
        res.json(response.data);
        break;
      case "notfound":
        res.status(404);
        res.end();
        break;
      default:
        throw new Error(`Invalid response: ${JSON.stringify(response, null, 2)}`);
    }
  } catch (err) {
    next(err);
  }
});
// end-generated-section httpHooks

if (require.main === module) {
  initDatabase().catch((e) => {
    // tslint:disable-next-line no-console
    console.error(e);
    process.exit(1);
  });
  // tslint:disable-next-line no-console
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}
