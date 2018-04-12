import { listApartments } from "@/endpoints/listApartments";
import { createTestApartments } from "@/testing/apartments";
import { useTestingDatabase } from "@/testing/db";
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

useTestingDatabase();

beforeEach(async () => {
  await createTestUsers();
  await createTestApartments();
});

test("guests cannot see apartments", async () => {
  const response = await listApartments(
    {
      Authorization: "",
    },
    {},
  );
  expect(response).toMatchObject({
    kind: "unauthorized",
    data: "Invalid credentials.",
  });
});

test("clients can only see rentable apartments", async () => {
  const response = await listApartments(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    {},
  );
  if (response.kind !== "success") {
    throw expect(response.kind).toMatchObject({
      kind: "success",
    });
  }
  expect(response.data.totalResults).toBe(68);
  expect(response.data.pageCount).toBe(1);
  response.data.results.forEach((apartment) =>
    expect(apartment.info.rented).toBeFalsy(),
  );

  const responseWithRentedFalseFilter = await listApartments(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    {
      filter: {
        rented: false,
      },
    },
  );
  expect(responseWithRentedFalseFilter).toEqual(response);

  const responseWithRentedTrueFilter = await listApartments(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    {
      filter: {
        rented: true,
      },
    },
  );
  expect(responseWithRentedTrueFilter).toEqual({
    kind: "unauthorized",
    data: "Clients cannot see rented apartments.",
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
  );
  if (response.kind !== "success") {
    throw expect(response.kind).toMatchObject({
      kind: "success",
    });
  }
  expect(response.data.totalResults).toBe(34);

  const responseMissingRealtorId = await listApartments(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    {
      filter: {
        realtorId: "missing",
      },
    },
  );
  if (responseMissingRealtorId.kind !== "success") {
    throw expect(responseMissingRealtorId.kind).toMatchObject({
      kind: "success",
    });
  }
  expect(responseMissingRealtorId.data.totalResults).toBe(0);
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
  );
  if (responseRange1.kind !== "success") {
    throw expect(responseRange1.kind).toMatchObject({
      kind: "success",
    });
  }
  expect(responseRange1.data.totalResults).toBe(2);

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
  );
  if (responseRange2.kind !== "success") {
    throw expect(responseRange2.kind).toMatchObject({
      kind: "success",
    });
  }
  expect(responseRange2.data.totalResults).toBe(62);

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
  );
  if (responseRange3.kind !== "success") {
    throw expect(responseRange3.kind).toMatchObject({
      kind: "success",
    });
  }
  expect(responseRange3.data.totalResults).toBe(14);
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
  );
  if (responseRange1.kind !== "success") {
    throw expect(responseRange1.kind).toMatchObject({
      kind: "success",
    });
  }
  expect(responseRange1.data.totalResults).toBe(4);

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
  );
  if (responseRange2.kind !== "success") {
    throw expect(responseRange2.kind).toMatchObject({
      kind: "success",
    });
  }
  expect(responseRange2.data.totalResults).toBe(34);

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
  );
  if (responseRange3.kind !== "success") {
    throw expect(responseRange3.kind).toMatchObject({
      kind: "success",
    });
  }
  expect(responseRange3.data.totalResults).toBe(14);
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
  );
  if (responseRange1.kind !== "success") {
    throw expect(responseRange1.kind).toMatchObject({
      kind: "success",
    });
  }
  expect(responseRange1.data.totalResults).toBe(2);

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
  );
  if (responseRange2.kind !== "success") {
    throw expect(responseRange2.kind).toMatchObject({
      kind: "success",
    });
  }
  expect(responseRange2.data.totalResults).toBe(12);

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
  );
  if (responseRange3.kind !== "success") {
    throw expect(responseRange3.kind).toMatchObject({
      kind: "success",
    });
  }
  expect(responseRange3.data.totalResults).toBe(6);
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
  );
  if (response.kind !== "success") {
    throw expect(response.kind).toMatchObject({
      kind: "success",
    });
  }
  expect(response.data.totalResults).toBe(2);
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
  );
  if (response.kind !== "success") {
    throw expect(response.kind).toMatchObject({
      kind: "success",
    });
  }
  const rentedApartments = response.data.results.filter((a) => a.info.rented)
    .length;
  const rentableApartments = response.data.results.length - rentedApartments;
  expect(response.data.totalResults).toBe(100);
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
  );
  if (response.kind !== "success") {
    throw expect(response.kind).toMatchObject({
      kind: "success",
    });
  }
  const rentedApartments = response.data.results.filter((a) => a.info.rented)
    .length;
  const rentableApartments = response.data.results.length - rentedApartments;
  expect(response.data.totalResults).toBe(34);
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
  );
  expect(responseWithRentedTrueFilter).toEqual({
    kind: "unauthorized",
    data: "Realtors cannot see others' rented apartments.",
  });

  const responseWithRentedFalseFilter = await listApartments(
    await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
    {
      filter: {
        realtorId: otherRealtor.userId,
        rented: false,
      },
    },
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
  );
  if (response.kind !== "success") {
    throw expect(response.kind).toMatchObject({
      kind: "success",
    });
  }
  expect(response.data.totalResults).toBe(2);
});

test("admins can see all apartments", async () => {
  const response = await listApartments(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    {},
  );
  if (response.kind !== "success") {
    throw expect(response.kind).toMatchObject({
      kind: "success",
    });
  }
  expect(response.data.totalResults).toBe(200);
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
  );
  if (response.kind !== "success") {
    throw expect(response.kind).toMatchObject({
      kind: "success",
    });
  }
  expect(response.data.totalResults).toBe(4);
});

test("apartments pagination without filters", async () => {
  // There is a total of 68 apartments, so we expect 3 pages when we request 30
  // per page.
  const apartmentsPerPage = 30;
  const headers = await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD);
  const page1 = await listApartments(headers, {
    maxPerPage: apartmentsPerPage,
    page: 1,
  });
  if (page1.kind !== "success") {
    throw expect(page1.kind).toMatchObject({
      kind: "success",
    });
  }
  expect(page1.data.totalResults).toBe(68);
  expect(page1.data.results.length).toBe(30);
  expect(page1.data.pageCount).toBe(3);
  const page2 = await listApartments(headers, {
    maxPerPage: apartmentsPerPage,
    page: 2,
  });
  if (page2.kind !== "success") {
    throw expect(page2.kind).toMatchObject({
      kind: "success",
    });
  }
  expect(page2.data.totalResults).toBe(68);
  expect(page2.data.results.length).toBe(30);
  expect(page2.data.pageCount).toBe(3);
  const page3 = await listApartments(headers, {
    maxPerPage: apartmentsPerPage,
    page: 3,
  });
  if (page3.kind !== "success") {
    throw expect(page3.kind).toMatchObject({
      kind: "success",
    });
  }
  expect(page3.data.totalResults).toBe(68);
  expect(page3.data.results.length).toBe(8);
  expect(page3.data.pageCount).toBe(3);
});

test("apartments pagination stops exactly when required", async () => {
  // There is a total of 68 apartments. We expect one page when requesting 68,
  // but two pages when requesting 67.
  const headers = await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD);
  const requesting67 = await listApartments(headers, { maxPerPage: 67 });
  if (requesting67.kind !== "success") {
    throw expect(requesting67.kind).toMatchObject({
      kind: "success",
    });
  }
  const requesting68 = await listApartments(headers, { maxPerPage: 68 });
  if (requesting68.kind !== "success") {
    throw expect(requesting68.kind).toMatchObject({
      kind: "success",
    });
  }
  expect(requesting67.data.totalResults).toBe(68);
  expect(requesting68.data.totalResults).toBe(68);
  expect(requesting67.data.pageCount).toBe(2);
  expect(requesting68.data.pageCount).toBe(1);
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
      maxPerPage: apartmentsPerPage,
      page: 1,
    },
  );
  if (page1.kind !== "success") {
    throw expect(page1.kind).toMatchObject({
      kind: "success",
    });
  }
  expect(page1.data.totalResults).toBe(6);
  expect(page1.data.results.length).toBe(5);
  expect(page1.data.pageCount).toBe(2);
  const page2 = await listApartments(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    {
      filter: {
        numberOfRooms: {
          min: 10,
          max: 20,
        },
      },
      maxPerPage: apartmentsPerPage,
      page: 2,
    },
  );
  if (page2.kind !== "success") {
    throw expect(page2.kind).toMatchObject({
      kind: "success",
    });
  }
  expect(page2.data.totalResults).toBe(6);
  expect(page2.data.results.length).toBe(1);
  expect(page2.data.pageCount).toBe(2);
});
