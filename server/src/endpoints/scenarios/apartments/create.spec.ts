import { createApartment } from "@/endpoints/createApartment";
import { findNewestApartment } from "@/testing/apartments";
import { useTestingDatabase } from "@/testing/db";
import {
  ADMIN_FRANK,
  ANNA_PASSWORD,
  authHeaders,
  CLIENT_ANNA,
  createTestUsers,
  findUser,
  FRANK_PASSWORD,
  JOHN_PASSWORD,
  REALTOR_HELENA,
  REALTOR_JOHN,
} from "@/testing/users";
import "jest";

useTestingDatabase();

beforeEach(async () => {
  await createTestUsers();
});

test("clients cannot create apartment listings", async () => {
  const response = await createApartment(
    await authHeaders(CLIENT_ANNA, ANNA_PASSWORD),
    {
      info: {
        floorArea: 20,
        pricePerMonth: 1000,
        numberOfRooms: 1,
        coordinates: {
          latitude: 20,
          longitude: 30,
        },
        rented: false,
      },
    },
  );
  expect(response).toMatchObject({
    status: "error",
    message: "Clients cannot create apartment listings.",
  });
});

test("realtors can create apartment listings", async () => {
  const realtor = await findUser(REALTOR_JOHN);
  const response = await createApartment(
    await authHeaders(REALTOR_JOHN, JOHN_PASSWORD),
    {
      info: {
        floorArea: 20,
        pricePerMonth: 1000,
        numberOfRooms: 1,
        coordinates: {
          latitude: 20,
          longitude: 30,
        },
        rented: false,
      },
    },
  );
  expect(response).toMatchObject({
    status: "success",
    message: "Apartment listing was created successfully.",
  });
  const apartment = await findNewestApartment();
  expect(apartment.realtor.userId).toBe(realtor.userId);
});

test("realtors cannot set another realtor create apartment listings", async () => {
  const realtor = await findUser(REALTOR_JOHN);
  const otherRealtor = await findUser(REALTOR_HELENA);
  const response = await createApartment(
    await authHeaders(REALTOR_JOHN, JOHN_PASSWORD),
    {
      info: {
        floorArea: 20,
        pricePerMonth: 1000,
        numberOfRooms: 1,
        coordinates: {
          latitude: 20,
          longitude: 30,
        },
        rented: false,
      },
      // This will be ignored.
      realtorId: otherRealtor.userId,
    },
  );
  expect(response).toMatchObject({
    status: "success",
    message: "Apartment listing was created successfully.",
  });
  const apartment = await findNewestApartment();
  expect(apartment.realtor.userId).toBe(realtor.userId);
});

test("admins can create apartment listings for realtors", async () => {
  const realtor = await findUser(REALTOR_HELENA);
  const response = await createApartment(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    {
      info: {
        floorArea: 20,
        pricePerMonth: 1000,
        numberOfRooms: 1,
        coordinates: {
          latitude: 20,
          longitude: 30,
        },
        rented: false,
      },
      realtorId: realtor.userId,
    },
  );
  expect(response).toMatchObject({
    status: "success",
    message: "Apartment listing was created successfully.",
  });
  const apartment = await findNewestApartment();
  expect(apartment.realtor.userId).toBe(realtor.userId);
});
