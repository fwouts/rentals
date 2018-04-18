import { ApartmentInfo } from "@/api/types";
import { connection } from "@/db/connections";
import { Apartment } from "@/db/entities/apartment";
import { deleteApartment } from "@/endpoints/deleteApartment";
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

const APARTMENT_INFO: ApartmentInfo = {
  floorArea: 20,
  pricePerMonth: 1000,
  numberOfRooms: 1,
  coordinates: {
    latitude: 20,
    longitude: 30,
  },
  rented: false,
};

useTestingDatabase();

beforeEach(async () => {
  await createTestUsers();
});

test("clients cannot delete apartment listings", async () => {
  const realtor = await findUser(REALTOR_HELENA);
  const apartment = Apartment.create(APARTMENT_INFO, realtor.userId);
  await connection.manager.save(apartment);

  const response = await deleteApartment(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    apartment.apartmentId,
  );
  expect(response).toMatchObject({
    kind: "unauthorized",
    data: "Clients cannot delete apartment listings.",
  });
});

test("realtors can delete their own apartment listings", async () => {
  const realtor = await findUser(REALTOR_HELENA);
  const apartment = Apartment.create(APARTMENT_INFO, realtor.userId);
  await connection.manager.save(apartment);

  const response = await deleteApartment(
    await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
    apartment.apartmentId,
  );
  expect(response).toMatchObject({
    kind: "success",
    data: "The apartment listing was deleted successfully.",
  });
});

test("realtors cannot delete other realtors' apartment listings", async () => {
  const realtor = await findUser(REALTOR_HELENA);
  const apartment = Apartment.create(APARTMENT_INFO, realtor.userId);
  await connection.manager.save(apartment);

  const response = await deleteApartment(
    await authHeaders(REALTOR_JOHN, JOHN_PASSWORD),
    apartment.apartmentId,
  );
  expect(response).toMatchObject({
    kind: "unauthorized",
    data: "Realtors cannot delete other realtors' apartment listings.",
  });
});

test("admins can any realtor's apartment listings", async () => {
  const realtor = await findUser(REALTOR_HELENA);
  const apartment = Apartment.create(APARTMENT_INFO, realtor.userId);
  await connection.manager.save(apartment);

  const response = await deleteApartment(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    apartment.apartmentId,
  );
  expect(response).toMatchObject({
    kind: "success",
    data: "The apartment listing was deleted successfully.",
  });
});

test("missing apartment listings raise error", async () => {
  const response = await deleteApartment(
    await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
    "missing",
  );
  expect(response).toMatchObject({
    kind: "notfound",
  });
});
