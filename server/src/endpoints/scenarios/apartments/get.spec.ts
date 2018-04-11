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
  await expect(
    getApartment(
      {
        Authorization: "",
      },
      apartment.apartmentId,
    ),
  ).rejects.toMatchObject({
    message: "Invalid session token.",
  });
});

test("clients can only see rentable apartments", async () => {
  const apartment = await findNewestApartment();
  apartment.rented = false;
  await connection.manager.save(apartment);
  await expect(
    getApartment(
      await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
      apartment.apartmentId,
    ),
  ).resolves.toMatchObject({
    apartmentId: apartment.apartmentId,
  });

  apartment.rented = true;
  await connection.manager.save(apartment);
  await expect(
    getApartment(
      await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
      apartment.apartmentId,
    ),
  ).rejects.toMatchObject({
    message: "Clients cannot see rented apartments.",
  });
});

test("realtors can see all their own apartments", async () => {
  const apartment = await findNewestApartment(REALTOR_HELENA);
  apartment.rented = false;
  await connection.manager.save(apartment);
  await expect(
    getApartment(
      await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
      apartment.apartmentId,
    ),
  ).resolves.toMatchObject({
    apartmentId: apartment.apartmentId,
  });

  apartment.rented = true;
  await connection.manager.save(apartment);
  await expect(
    getApartment(
      await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
      apartment.apartmentId,
    ),
  ).resolves.toMatchObject({
    apartmentId: apartment.apartmentId,
  });
});

test("realtors can only see other realtors' rentable apartments", async () => {
  const apartment = await findNewestApartment(REALTOR_JOHN);
  apartment.rented = false;
  await connection.manager.save(apartment);
  await expect(
    getApartment(
      await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
      apartment.apartmentId,
    ),
  ).resolves.toMatchObject({
    apartmentId: apartment.apartmentId,
  });

  apartment.rented = true;
  await connection.manager.save(apartment);
  await expect(
    getApartment(
      await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
      apartment.apartmentId,
    ),
  ).rejects.toMatchObject({
    message: "Realtors cannot see others' rented apartments.",
  });
});

test("admins can see all apartments", async () => {
  const apartment = await findNewestApartment(REALTOR_HELENA);
  apartment.rented = false;
  await connection.manager.save(apartment);
  await expect(
    getApartment(
      await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
      apartment.apartmentId,
    ),
  ).resolves.toMatchObject({
    apartmentId: apartment.apartmentId,
  });

  apartment.rented = true;
  await connection.manager.save(apartment);
  await expect(
    getApartment(
      await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
      apartment.apartmentId,
    ),
  ).resolves.toMatchObject({
    apartmentId: apartment.apartmentId,
  });
});
