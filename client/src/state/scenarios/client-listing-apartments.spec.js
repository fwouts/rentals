import { AppController } from "../app";
import uuid from "uuid";
import { resetDatabase } from "../../testing/integration/client";
import "jest";

beforeEach(async () => {
  await resetDatabase();
});

test("client listing apartments", async () => {
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

  // Load the first page of all apartments.
  const firstPage = app.state.listApartments();
  expect(app.state).toMatchObject({
    kind: "authenticated-client",
    state: {
      kind: "listing-apartments",
      loading: true,
      apartments: [],
    },
  });
  await firstPage;
  expect(app.state).toMatchObject({
    kind: "authenticated-client",
    state: {
      kind: "listing-apartments",
      loading: false,
      total: 68,
    },
  });
  expect(app.state.state.apartments.length).toBe(20);

  // Load the second page.
  const nextPage = app.state.state.loadMore();
  expect(app.state).toMatchObject({
    kind: "authenticated-client",
    state: {
      kind: "listing-apartments",
      loading: true,
      total: 68,
    },
  });
  await nextPage;
  expect(app.state).toMatchObject({
    kind: "authenticated-client",
    state: {
      kind: "listing-apartments",
      loading: false,
      total: 68,
    },
  });
  expect(app.state.state.apartments.length).toBe(40);

  // Tweak the filters.
  app.state.state.filter.numberOfRooms = {
    min: 5,
    max: 50,
  };

  // Load the first page of filtered results.
  const filteredFirstPage = app.state.state.loadFresh();
  expect(app.state).toMatchObject({
    kind: "authenticated-client",
    state: {
      kind: "listing-apartments",
      loading: true,
      total: 68,
    },
  });
  await filteredFirstPage;
  expect(app.state).toMatchObject({
    kind: "authenticated-client",
    state: {
      kind: "listing-apartments",
      loading: false,
      total: 30,
    },
  });
  expect(app.state.state.apartments.length).toBe(20);

  // Load the second page.
  const filteredSecondPage = app.state.state.loadMore();
  expect(app.state).toMatchObject({
    kind: "authenticated-client",
    state: {
      kind: "listing-apartments",
      loading: true,
      total: 30,
    },
  });
  await filteredSecondPage;
  expect(app.state).toMatchObject({
    kind: "authenticated-client",
    state: {
      kind: "listing-apartments",
      loading: false,
      total: 30,
    },
  });
  expect(app.state.state.apartments.length).toBe(30);
});
