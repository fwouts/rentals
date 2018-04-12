import "module-alias/register";

import { initDatabase } from "@/db";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import * as api from "./api";
import { resetDatabase } from "./endpoints/resetDatabase";

const PORT = 3020;

const app = express();
app.use(bodyParser.json());
// TODO: Change CORS configuration.
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
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
    const response: api.ResetDatabase_Response = await resetDatabase();
    switch (response.kind) {
      case "success":
        res.status(200);
        res.end();
        break;
      default:
        throw new Error(
          `Invalid response: ${JSON.stringify(response, null, 2)}`,
        );
    }
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
