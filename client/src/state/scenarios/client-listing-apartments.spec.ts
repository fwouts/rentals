import "jest";
import { resetDatabase } from "../../testing/integration/client";
import { AppController } from "../app";

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
  const registeringState = app.state;
  if (registeringState.kind !== "registering") {
    throw expect(app.state).toMatchObject({
      kind: "registering",
    });
  }
  registeringState.email = "f@zenc.io";
  registeringState.password = "test!$Yes1";
  registeringState.confirmPassword = "test!$Yes1";
  registeringState.name = "Francois";
  registeringState.role = "client";
  await registeringState.submit();

  const authenticatingState = app.state;
  if (authenticatingState.kind !== "authenticating") {
    throw expect(app.state).toMatchObject({
      kind: "authenticating",
    });
  }

  // Authenticate user.
  authenticatingState.email = "f@zenc.io";
  authenticatingState.password = "test!$Yes1";
  await authenticatingState.submit();

  const authenticatedState = app.state;
  if (authenticatedState.kind !== "authenticated-client") {
    throw expect(app.state).toMatchObject({
      kind: "authenticated-client",
    });
  }

  // Load the first page of all apartments.
  const firstPage = authenticatedState.listApartments();
  const listingApartments = authenticatedState.state;
  if (listingApartments.kind !== "listing-apartments") {
    throw expect(app.state).toMatchObject({
      kind: "listing-apartments",
    });
  }
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
  expect(listingApartments.apartments.length).toBe(20);

  // Load the second page.
  const nextPage = listingApartments.loadMore();
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
  expect(listingApartments.apartments.length).toBe(40);

  // Tweak the filters.
  listingApartments.filter.numberOfRooms = {
    min: 5,
    max: 50,
  };

  // Load the first page of filtered results.
  const filteredFirstPage = listingApartments.loadFresh();
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
  expect(listingApartments.apartments.length).toBe(20);

  // Load the second page.
  const filteredSecondPage = listingApartments.loadMore();
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
  expect(listingApartments.apartments.length).toBe(30);
});
