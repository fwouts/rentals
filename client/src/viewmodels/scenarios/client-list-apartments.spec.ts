import "jest";
import { resetDatabase } from "../../testing/integration/client";
import { AppController } from "../app";

beforeEach(async () => {
  await resetDatabase();
});

test("client list apartments", async () => {
  const app = new AppController();
  expect(app.state).toMatchObject({
    kind: "unauthenticated",
  });

  // Register user.
  app.register();
  const registerState = app.state;
  if (registerState.kind !== "register") {
    throw expect(app.state).toMatchObject({
      kind: "register",
    });
  }
  registerState.email = "f@zenc.io";
  registerState.password = "test!$Yes1";
  registerState.confirmPassword = "test!$Yes1";
  registerState.name = "Francois";
  registerState.role = "client";
  await registerState.submit();

  const authenticateState = app.state;
  if (authenticateState.kind !== "signin") {
    throw expect(app.state).toMatchObject({
      kind: "signin",
    });
  }

  // Authenticate user.
  authenticateState.email = "f@zenc.io";
  authenticateState.password = "test!$Yes1";
  await authenticateState.submit();

  const authenticatedState = app.state;
  if (authenticatedState.kind !== "authenticated-client") {
    throw expect(app.state).toMatchObject({
      kind: "authenticated-client",
    });
  }

  // Load the first page of all apartments.
  const firstPage = authenticatedState.listApartments();
  const listApartments = authenticatedState.state;
  if (listApartments.kind !== "list-apartments") {
    throw expect(app.state).toMatchObject({
      kind: "list-apartments",
    });
  }
  expect(app.state).toMatchObject({
    kind: "authenticated-client",
    state: {
      kind: "list-apartments",
      loading: true,
      currentPage: 1,
      pageCount: 0,
    },
  });
  await firstPage;
  expect(app.state).toMatchObject({
    kind: "authenticated-client",
    state: {
      kind: "list-apartments",
      loading: false,
      total: 68,
      currentPage: 1,
      pageCount: 7,
    },
  });
  expect(listApartments.apartments.length).toBe(10);

  // Load the second page.
  const nextPage = listApartments.loadPage(2);
  expect(app.state).toMatchObject({
    kind: "authenticated-client",
    state: {
      kind: "list-apartments",
      loading: true,
      total: 68,
      currentPage: 1,
      pageCount: 7,
    },
  });
  await nextPage;
  expect(app.state).toMatchObject({
    kind: "authenticated-client",
    state: {
      kind: "list-apartments",
      loading: false,
      total: 68,
      currentPage: 2,
      pageCount: 7,
    },
  });
  expect(listApartments.apartments.length).toBe(10);

  // Tweak the filters.
  listApartments.filter.numberOfRooms = {
    min: 7,
    max: 50,
  };

  // Load the first page of filtered results.
  const filteredFirstPage = listApartments.loadFresh();
  expect(app.state).toMatchObject({
    kind: "authenticated-client",
    state: {
      kind: "list-apartments",
      loading: true,
      total: 0,
      currentPage: 1,
      pageCount: 0,
    },
  });
  await filteredFirstPage;
  expect(app.state).toMatchObject({
    kind: "authenticated-client",
    state: {
      kind: "list-apartments",
      loading: false,
      total: 28,
      currentPage: 1,
      pageCount: 3,
    },
  });
  expect(listApartments.apartments.length).toBe(10);

  // Load the third page.
  const filteredThirdPage = listApartments.loadPage(3);
  expect(app.state).toMatchObject({
    kind: "authenticated-client",
    state: {
      kind: "list-apartments",
      loading: true,
      total: 28,
      currentPage: 1,
      pageCount: 3,
    },
  });
  await filteredThirdPage;
  expect(app.state).toMatchObject({
    kind: "authenticated-client",
    state: {
      kind: "list-apartments",
      loading: false,
      total: 28,
      currentPage: 3,
      pageCount: 3,
    },
  });
  expect(listApartments.apartments.length).toBe(8);
});
