import { updateApartment } from "@/endpoints/updateApartment";
import {
  createTestApartments,
  findNewestApartment,
} from "@/testing/apartments";
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
  JOHN_PASSWORD,
  REALTOR_HELENA,
  REALTOR_JOHN,
} from "@/testing/users";
import "jest";

useTestingDatabase();

beforeEach(async () => {
  await createTestUsers();
  await createTestApartments();
});

test("clients cannot update apartments", async () => {
  const apartment = await findNewestApartment(REALTOR_JOHN);
  const response = await updateApartment(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    apartment.apartmentId,
    {
      info: {
        floorArea: apartment.floorArea,
        pricePerMonth: apartment.pricePerMonth,
        numberOfRooms: apartment.numberOfRooms,
        coordinates: {
          latitude: apartment.latitude,
          longitude: apartment.longitude,
        },
        rented: apartment.rented,
      },
    },
  );
  expect(response).toEqual({
    kind: "unauthorized",
    data: "Clients cannot update apartment listings.",
  });
  const updatedApartment = await findNewestApartment(REALTOR_JOHN);
  expect(updatedApartment).toEqual(apartment);
});

test("realtors can update their own apartments", async () => {
  const apartment = await findNewestApartment(REALTOR_JOHN);
  expect(apartment).toMatchObject({
    floorArea: 109,
    pricePerMonth: 1990,
    numberOfRooms: 99,
    realtor: {
      email: REALTOR_JOHN,
      role: "realtor",
    },
    rented: false,
  });
  const response = await updateApartment(
    await authHeaders(REALTOR_JOHN, JOHN_PASSWORD),
    apartment.apartmentId,
    {
      info: {
        floorArea: 900,
        pricePerMonth: 2000,
        numberOfRooms: 12,
        coordinates: {
          latitude: 21,
          longitude: 42,
        },
        rented: true,
      },
    },
  );
  expect(response).toEqual({
    kind: "success",
    data: "The apartment listing was updated successfully.",
  });
  const updatedApartment = await findNewestApartment(REALTOR_JOHN);
  expect(updatedApartment).toMatchObject({
    floorArea: 900,
    pricePerMonth: 2000,
    numberOfRooms: 12,
    latitude: 21,
    longitude: 42,
    realtor: {
      email: REALTOR_JOHN,
      role: "realtor",
    },
    rented: true,
  });
});

test("realtors cannot update others' apartments", async () => {
  const apartment = await findNewestApartment(REALTOR_JOHN);
  const response = await updateApartment(
    await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
    apartment.apartmentId,
    {
      info: {
        floorArea: 900,
        pricePerMonth: 2000,
        numberOfRooms: 12,
        coordinates: {
          latitude: 20,
          longitude: 40,
        },
        rented: true,
      },
    },
  );
  expect(response).toEqual({
    kind: "unauthorized",
    data: "Realtors cannot update other realtors' apartment listings.",
  });
  const updatedApartment = await findNewestApartment(REALTOR_JOHN);
  expect(updatedApartment).toEqual(apartment);
});

test("realtors cannot change apartment realtors", async () => {
  const apartment = await findNewestApartment(REALTOR_JOHN);
  const response = await updateApartment(
    await authHeaders(REALTOR_JOHN, JOHN_PASSWORD),
    apartment.apartmentId,
    {
      info: {
        floorArea: 900,
        pricePerMonth: 2000,
        numberOfRooms: 12,
        coordinates: {
          latitude: 20,
          longitude: 40,
        },
        rented: true,
      },
      realtorId: (await findUser(REALTOR_HELENA)).userId,
    },
  );
  expect(response).toEqual({
    kind: "unauthorized",
    data: "Realtors cannot reassign apartments to other realtors.",
  });
  const updatedApartment = await findNewestApartment(REALTOR_JOHN);
  expect(updatedApartment).toEqual(apartment);
});

test("admins can update all apartments", async () => {
  const apartment = await findNewestApartment(REALTOR_JOHN);
  expect(apartment).toMatchObject({
    floorArea: 109,
    pricePerMonth: 1990,
    numberOfRooms: 99,
    realtor: {
      email: REALTOR_JOHN,
      role: "realtor",
    },
    rented: false,
  });
  const response = await updateApartment(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    apartment.apartmentId,
    {
      info: {
        floorArea: 900,
        pricePerMonth: 2000,
        numberOfRooms: 12,
        coordinates: {
          latitude: 21,
          longitude: 42,
        },
        rented: true,
      },
    },
  );
  expect(response).toEqual({
    kind: "success",
    data: "The apartment listing was updated successfully.",
  });
  const updatedApartment = await findNewestApartment(REALTOR_JOHN);
  expect(updatedApartment).toMatchObject({
    floorArea: 900,
    pricePerMonth: 2000,
    numberOfRooms: 12,
    latitude: 21,
    longitude: 42,
    realtor: {
      email: REALTOR_JOHN,
      role: "realtor",
    },
    rented: true,
  });
});

test("admins can change apartment realtors", async () => {
  const apartment = await findNewestApartment(REALTOR_JOHN);
  expect(apartment).toMatchObject({
    floorArea: 109,
    pricePerMonth: 1990,
    numberOfRooms: 99,
    realtor: {
      email: REALTOR_JOHN,
      role: "realtor",
    },
    rented: false,
  });
  const response = await updateApartment(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    apartment.apartmentId,
    {
      info: {
        floorArea: 900,
        pricePerMonth: 2000,
        numberOfRooms: 12,
        coordinates: {
          latitude: 21,
          longitude: 42,
        },
        rented: true,
      },
      realtorId: (await findUser(REALTOR_HELENA)).userId,
    },
  );
  expect(response).toEqual({
    kind: "success",
    data: "The apartment listing was updated successfully.",
  });
  const updatedApartment = await findNewestApartment(REALTOR_HELENA);
  expect(updatedApartment).toMatchObject({
    floorArea: 900,
    pricePerMonth: 2000,
    numberOfRooms: 12,
    latitude: 21,
    longitude: 42,
    realtor: {
      email: REALTOR_HELENA,
      role: "realtor",
    },
    rented: true,
  });
});
