import { AppController } from "../app";
import uuid from "uuid";

test("say hello", async () => {
  const uniqueEmail = uuid.v4() + "@gmail.com";
  const app = new AppController();
  expect(app.state).toMatchObject({
    kind: "unauthenticated",
  });

  // Register user.
  app.register();
  expect(app.state).toMatchObject({
    kind: "registering",
  });
  app.state.email = uniqueEmail;
  app.state.password = "test!$Yes1";
  app.state.confirmPassword = "test!$Yes1";
  app.state.name = "Francois";
  app.state.role = "client";
  await app.state.submit();
  expect(app.state).toMatchObject({
    kind: "authenticating",
  });

  // Authenticate user.
  app.state.email = uniqueEmail;
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
