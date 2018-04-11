import { Router } from "../router";
import { AppController, AppViewModel } from "./app";

export function configureRoutes(
  router: Router<AppViewModel>,
  app: AppController,
) {
  router.route(
    "/",
    () => {
      switch (app.state.kind) {
        case "authenticated-admin":
        case "authenticated-realtor":
        case "authenticated-client":
          app.state.listApartments();
          break;
        default:
          app.signOut();
      }
    },
    (state) => state.kind === "unauthenticated",
  );
  router.route(
    "/signin",
    () => {
      switch (app.state.kind) {
        case "authenticated-admin":
        case "authenticated-realtor":
        case "authenticated-client":
          app.state.listApartments();
          break;
        default:
          app.signIn();
      }
    },
    (state) => state.kind === "signin",
  );
  router.route(
    "/register",
    () => {
      switch (app.state.kind) {
        case "authenticated-admin":
        case "authenticated-realtor":
        case "authenticated-client":
          app.state.listApartments();
          break;
        default:
          app.register();
      }
    },
    (state) => state.kind === "register",
  );
  router.route(
    "/verify/:token",
    (token) => {
      app.verify(token);
    },
    (state) => state.kind === "verify" && `/verify/${state.token}`,
  );
  router.route(
    "/admin/users",
    () => app.state.kind === "authenticated-admin" && app.state.listUsers(),
    (state) =>
      state.kind === "authenticated-admin" &&
      state.state.kind === "admin-list-users",
  );
  router.route(
    "/admin/users/create",
    () => app.state.kind === "authenticated-admin" && app.state.createUser(),
    (state) =>
      state.kind === "authenticated-admin" &&
      state.state.kind === "admin-create-user",
  );
  router.route(
    "/admin/users/:id/update",
    (userId) =>
      app.state.kind === "authenticated-admin" &&
      app.state.fetchThenUpdateUser(userId),
    (state) =>
      state.kind === "authenticated-admin" &&
      state.state.kind === "admin-update-user" &&
      `/admin/users/${state.state.userId}/update`,
  );
  router.route(
    "/admin/users/:id/delete",
    (userId) =>
      app.state.kind === "authenticated-admin" &&
      app.state.fetchThenDeleteUser(userId),
    (state) =>
      state.kind === "authenticated-admin" &&
      state.state.kind === "admin-delete-user" &&
      ` / admin/users/${state.state.user.userId}/delete`,
  );
  router.route(
    "/apartments",
    () => {
      switch (app.state.kind) {
        case "authenticated-admin":
        case "authenticated-realtor":
        case "authenticated-client":
          app.state.listApartments();
          break;
      }
    },
    (state) =>
      (state.kind === "authenticated-admin" ||
        state.kind === "authenticated-realtor" ||
        state.kind === "authenticated-client") &&
      state.state.kind === "list-apartments",
  );
  router.route(
    "/apartments/create",
    () => {
      switch (app.state.kind) {
        case "authenticated-admin":
        case "authenticated-realtor":
          app.state.createApartment();
          break;
        case "authenticated-client":
          app.state.listApartments();
          break;
      }
    },
    (state) =>
      (state.kind === "authenticated-admin" ||
        state.kind === "authenticated-realtor") &&
      state.state.kind === "create-apartment",
  );
  router.route(
    "/apartments/:id/update",
    (apartmentId) => {
      switch (app.state.kind) {
        case "authenticated-admin":
        case "authenticated-realtor":
          app.state.fetchThenUpdateApartment(apartmentId);
          break;
        case "authenticated-client":
          app.state.listApartments();
          break;
      }
    },
    (state) =>
      (state.kind === "authenticated-admin" ||
        state.kind === "authenticated-realtor") &&
      state.state.kind === "update-apartment" &&
      `/apartments/${state.state.apartmentId}/update`,
  );
  router.route(
    "/account/update",
    () => {
      switch (app.state.kind) {
        case "authenticated-admin":
        case "authenticated-realtor":
        case "authenticated-client":
          app.state.updateUser();
          break;
      }
    },
    (state) =>
      (state.kind === "authenticated-admin" ||
        state.kind === "authenticated-realtor" ||
        state.kind === "authenticated-client") &&
      state.state.kind === "self-update-user",
  );
  router.route(
    "/account/delete",
    () => {
      switch (app.state.kind) {
        case "authenticated-admin":
        case "authenticated-realtor":
        case "authenticated-client":
          app.state.deleteUser();
          break;
      }
    },
    (state) =>
      (state.kind === "authenticated-admin" ||
        state.kind === "authenticated-realtor" ||
        state.kind === "authenticated-client") &&
      state.state.kind === "self-delete-user",
  );
}
