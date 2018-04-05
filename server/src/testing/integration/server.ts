import "module-alias/register";

import { initDatabase } from "@/db";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { resetDatabase } from "./endpoints/resetDatabase";

const PORT = 3020;

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        origin === "http://localhost" ||
        origin.startsWith("http://localhost:")
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Access is not allowed from ${origin}.`));
      }
    },
  }),
);

app.post("/reset", async (req, res, next) => {
  try {
    await resetDatabase();
    res.end();
  } catch (err) {
    next(err);
  }
});

if (require.main === module) {
  initDatabase().catch((e) => {
    // tslint:disable-next-line no-console
    console.error(e);
    process.exit(1);
  });
  // tslint:disable-next-line no-console
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}
