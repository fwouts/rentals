import { connection } from "@/db/connections";
import { getApartment } from "@/endpoints/getApartment";
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
  const apartment = await findNewestApartment();
  expect(
    await getApartment(
      {
        Authorization: "",
      },
      apartment.apartmentId,
    ),
  ).toMatchObject({
    kind: "unauthorized",
    data: "Invalid credentials.",
  });
});

test("clients can only see rentable apartments", async () => {
  const apartment = await findNewestApartment();
  apartment.rented = false;
  await connection.manager.save(apartment);
  expect(
    await getApartment(
      await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
      apartment.apartmentId,
    ),
  ).toMatchObject({
    kind: "success",
    data: {
      apartmentId: apartment.apartmentId,
    },
  });

  apartment.rented = true;
  await connection.manager.save(apartment);
  expect(
    await getApartment(
      await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
      apartment.apartmentId,
    ),
  ).toMatchObject({
    kind: "unauthorized",
    data: "Clients cannot see rented apartments.",
  });
});

test("realtors can see all their own apartments", async () => {
  const apartment = await findNewestApartment(REALTOR_HELENA);
  apartment.rented = false;
  await connection.manager.save(apartment);
  expect(
    await getApartment(
      await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
      apartment.apartmentId,
    ),
  ).toMatchObject({
    kind: "success",
    data: {
      apartmentId: apartment.apartmentId,
    },
  });

  apartment.rented = true;
  await connection.manager.save(apartment);
  expect(
    await getApartment(
      await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
      apartment.apartmentId,
    ),
  ).toMatchObject({
    kind: "success",
    data: {
      apartmentId: apartment.apartmentId,
    },
  });
});

test("realtors can only see other realtors' rentable apartments", async () => {
  const apartment = await findNewestApartment(REALTOR_JOHN);
  apartment.rented = false;
  await connection.manager.save(apartment);
  expect(
    await getApartment(
      await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
      apartment.apartmentId,
    ),
  ).toMatchObject({
    kind: "success",
    data: {
      apartmentId: apartment.apartmentId,
    },
  });

  apartment.rented = true;
  await connection.manager.save(apartment);
  expect(
    await getApartment(
      await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
      apartment.apartmentId,
    ),
  ).toMatchObject({
    kind: "unauthorized",
    data: "Realtors cannot see others' rented apartments.",
  });
});

test("admins can see all apartments", async () => {
  const apartment = await findNewestApartment(REALTOR_HELENA);
  apartment.rented = false;
  await connection.manager.save(apartment);
  expect(
    await getApartment(
      await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
      apartment.apartmentId,
    ),
  ).toMatchObject({
    kind: "success",
    data: {
      apartmentId: apartment.apartmentId,
    },
  });

  apartment.rented = true;
  await connection.manager.save(apartment);
  expect(
    await getApartment(
      await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
      apartment.apartmentId,
    ),
  ).toMatchObject({
    kind: "success",
    data: {
      apartmentId: apartment.apartmentId,
    },
  });
});
