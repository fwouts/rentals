import { AppController } from "../app";
import uuid from "uuid";
import { resetDatabase } from "../../testing/integration/client";
import "jest";

beforeEach(async () => {
  await resetDatabase();
});

test("say hello", async () => {
  const app = new AppController();
  expect(app.state).toMatchObject({
    kind: "unauthenticated",
  });

  // Register user.
  app.register();
  expect(app.state).toMatchObject({
    kind: "registering",
  });
  app.state.email = "f@zenc.io";
  app.state.password = "test!$Yes1";
  app.state.confirmPassword = "test!$Yes1";
  app.state.name = "Francois";
  app.state.role = "client";
  await app.state.submit();
  expect(app.state).toMatchObject({
    kind: "authenticating",
  });

  // Authenticate user.
  app.state.email = "f@zenc.io";
  app.state.password = "test!$Yes1";
  await app.state.submit();
  expect(app.state).toMatchObject({
    kind: "authenticated-client",
  });

  app.state.listApartments();
  expect(app.state).toMatchObject({
    kind: "authenticated-client",
    state: {
      kind: "listing-apartments",
    },
  });
});
