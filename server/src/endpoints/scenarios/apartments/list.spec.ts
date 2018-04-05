import { listApartments } from "@/endpoints/listApartments";
import { createTestApartments } from "@/testing/apartments";
import { useTestingDatabase } from "@/testing/db";
import { setUpJwtForTesting } from "@/testing/jwt";
import {
  ADMIN_FRANK,
  authHeaders,
  BRIAN_PASSWORD,
  CLIENT_BRIAN,
  createTestUsers,
  findUser,
  FRANK_PASSWORD,
  HELENA_PASSWORD,
  REALTOR_HELENA,
  REALTOR_JOHN,
} from "@/testing/users";

setUpJwtForTesting();
useTestingDatabase();

beforeEach(async () => {
  await createTestUsers();
  await createTestApartments();
});

const LOTS_OF_APARTMENTS_PER_PAGE = 500;

test("guests cannot see apartments", async () => {
  const response = await listApartments(
    {
      Authorization: "",
    },
    {},
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  expect(response).toEqual({
    results: [],
    totalResults: 0,
    pageCount: 0,
  });
});

test("clients can only see rentable apartments", async () => {
  const response = await listApartments(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    {},
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  expect(response.totalResults).toBe(68);
  expect(response.pageCount).toBe(1);
  response.results.forEach((apartment) =>
    expect(apartment.info.rented).toBeFalsy(),
  );

  const responseWithRentedFalseFilter = await listApartments(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    {
      filter: {
        rented: false,
      },
    },
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  expect(responseWithRentedFalseFilter).toEqual(response);

  const responseWithRentedTrueFilter = await listApartments(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    {
      filter: {
        rented: true,
      },
    },
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  expect(responseWithRentedTrueFilter).toEqual({
    totalResults: 0,
    results: [],
    pageCount: 0,
  });
});

test("clients can use realtor filter", async () => {
  const realtor = await findUser(REALTOR_JOHN);
  const response = await listApartments(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    {
      filter: {
        realtorId: realtor.userId,
      },
    },
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  expect(response.totalResults).toBe(34);

  const responseMissingRealtorId = await listApartments(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    {
      filter: {
        realtorId: "missing",
      },
    },
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  expect(responseMissingRealtorId.totalResults).toBe(0);
});

test("clients can use size range filter", async () => {
  const responseRange1 = await listApartments(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    {
      filter: {
        sizeRange: {
          min: 10,
          max: 12,
        },
      },
    },
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  expect(responseRange1.totalResults).toBe(2);

  const responseRange2 = await listApartments(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    {
      filter: {
        sizeRange: {
          min: 10,
          max: 100,
        },
      },
    },
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  expect(responseRange2.totalResults).toBe(62);

  const responseRange3 = await listApartments(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    {
      filter: {
        sizeRange: {
          min: 40,
          max: 60,
        },
      },
    },
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  expect(responseRange3.totalResults).toBe(14);
});

test("clients can use price range filter", async () => {
  const responseRange1 = await listApartments(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    {
      filter: {
        priceRange: {
          min: 1000,
          max: 1050,
        },
      },
    },
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  expect(responseRange1.totalResults).toBe(4);

  const responseRange2 = await listApartments(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    {
      filter: {
        priceRange: {
          min: 1000,
          max: 1500,
        },
      },
    },
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  expect(responseRange2.totalResults).toBe(34);

  const responseRange3 = await listApartments(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    {
      filter: {
        priceRange: {
          min: 1300,
          max: 1500,
        },
      },
    },
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  expect(responseRange3.totalResults).toBe(14);
});

test("clients can use number of rooms filter", async () => {
  const responseRange1 = await listApartments(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    {
      filter: {
        numberOfRooms: {
          min: 1,
          max: 3,
        },
      },
    },
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  expect(responseRange1.totalResults).toBe(2);

  const responseRange2 = await listApartments(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    {
      filter: {
        numberOfRooms: {
          min: 1,
          max: 20,
        },
      },
    },
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  expect(responseRange2.totalResults).toBe(12);

  const responseRange3 = await listApartments(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    {
      filter: {
        numberOfRooms: {
          min: 10,
          max: 20,
        },
      },
    },
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  expect(responseRange3.totalResults).toBe(6);
});

test("clients can combine filters", async () => {
  const realtor = await findUser(REALTOR_JOHN);
  const response = await listApartments(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    {
      filter: {
        realtorId: realtor.userId,
        priceRange: {
          min: 1100,
          max: 1200,
        },
        sizeRange: {
          min: 10,
          max: 30,
        },
        numberOfRooms: {
          min: 10,
          max: 15,
        },
      },
    },
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  expect(response.totalResults).toBe(2);
});

test("realtors can see all their own apartments", async () => {
  const realtor = await findUser(REALTOR_HELENA);
  const response = await listApartments(
    await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
    {
      filter: {
        realtorId: realtor.userId,
      },
    },
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  const rentedApartments = response.results.filter((a) => a.info.rented).length;
  const rentableApartments = response.results.length - rentedApartments;
  expect(response.totalResults).toBe(100);
  expect(rentedApartments).toBe(66);
  expect(rentableApartments).toBe(34);
});

test("realtors can only see other realtors' rentable apartments", async () => {
  const otherRealtor = await findUser(REALTOR_JOHN);
  const response = await listApartments(
    await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
    {
      filter: {
        realtorId: otherRealtor.userId,
      },
    },
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  const rentedApartments = response.results.filter((a) => a.info.rented).length;
  const rentableApartments = response.results.length - rentedApartments;
  expect(response.totalResults).toBe(34);
  expect(rentedApartments).toBe(0);
  expect(rentableApartments).toBe(34);

  const responseWithRentedTrueFilter = await listApartments(
    await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
    {
      filter: {
        realtorId: otherRealtor.userId,
        rented: true,
      },
    },
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  expect(responseWithRentedTrueFilter.totalResults).toBe(0);

  const responseWithRentedFalseFilter = await listApartments(
    await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
    {
      filter: {
        realtorId: otherRealtor.userId,
        rented: false,
      },
    },
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  expect(responseWithRentedFalseFilter).toEqual(response);
});

test("realtors can combine filters", async () => {
  const realtor = await findUser(REALTOR_JOHN);
  const response = await listApartments(
    await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
    {
      filter: {
        realtorId: realtor.userId,
        priceRange: {
          min: 1100,
          max: 1200,
        },
        sizeRange: {
          min: 10,
          max: 30,
        },
        numberOfRooms: {
          min: 10,
          max: 15,
        },
      },
    },
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  expect(response.totalResults).toBe(2);
});

test("admins can see all apartments", async () => {
  const response = await listApartments(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    {},
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  expect(response.totalResults).toBe(200);
});

test("admins can combine filters", async () => {
  const realtor = await findUser(REALTOR_JOHN);
  const response = await listApartments(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    {
      filter: {
        realtorId: realtor.userId,
        priceRange: {
          min: 1100,
          max: 1200,
        },
        sizeRange: {
          min: 10,
          max: 30,
        },
        numberOfRooms: {
          min: 10,
          max: 15,
        },
        rented: true,
      },
    },
    LOTS_OF_APARTMENTS_PER_PAGE,
  );
  expect(response.totalResults).toBe(4);
});

test("apartments pagination without filters", async () => {
  // There is a total of 68 apartments, so we expect 3 pages when we request 30
  // per page.
  const apartmentsPerPage = 30;
  const headers = await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD);
  const page1 = await listApartments(
    headers,
    {
      page: 1,
    },
    apartmentsPerPage,
  );
  expect(page1.totalResults).toBe(68);
  expect(page1.results.length).toBe(30);
  expect(page1.pageCount).toBe(3);
  const page2 = await listApartments(
    headers,
    {
      page: 2,
    },
    apartmentsPerPage,
  );
  expect(page2.totalResults).toBe(68);
  expect(page2.results.length).toBe(30);
  expect(page2.pageCount).toBe(3);
  const page3 = await listApartments(
    headers,
    {
      page: 3,
    },
    apartmentsPerPage,
  );
  expect(page3.totalResults).toBe(68);
  expect(page3.results.length).toBe(8);
  expect(page3.pageCount).toBe(3);
});

test("apartments pagination stops exactly when required", async () => {
  // There is a total of 68 apartments. We expect one page when requesting 68,
  // but two pages when requesting 67.
  const headers = await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD);
  const requesting67 = await listApartments(headers, {}, 67);
  const requesting68 = await listApartments(headers, {}, 68);
  expect(requesting67.totalResults).toBe(68);
  expect(requesting68.totalResults).toBe(68);
  expect(requesting67.pageCount).toBe(2);
  expect(requesting68.pageCount).toBe(1);
});

test("apartments pagination with filters", async () => {
  // We expect 6 apartments here.
  const apartmentsPerPage = 5;
  const page1 = await listApartments(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    {
      filter: {
        numberOfRooms: {
          min: 10,
          max: 20,
        },
      },
      page: 1,
    },
    apartmentsPerPage,
  );
  expect(page1.totalResults).toBe(6);
  expect(page1.results.length).toBe(5);
  expect(page1.pageCount).toBe(2);
  const page2 = await listApartments(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    {
      filter: {
        numberOfRooms: {
          min: 10,
          max: 20,
        },
      },
      page: 2,
    },
    apartmentsPerPage,
  );
  expect(page2.totalResults).toBe(6);
  expect(page2.results.length).toBe(1);
  expect(page2.pageCount).toBe(2);
});
