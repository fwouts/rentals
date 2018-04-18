import "module-alias/register";

import { initDatabase } from "@/db";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import * as types from "./api/types";

// start-generated-section endpointImports
import { resetDatabase } from "./endpoints/resetDatabase";
// end-generated-section endpointImports

const PORT = 3020;

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
      // If you want to only allow some origins, use the following instead:
      // callback(new Error(`Access is not allowed from ${origin}.`));
    },
  }),
);

// start-generated-section httpHooks
app.post("/reset", async (req, res, next) => {
  try {
    const response: types.ResetDatabase_Response = await resetDatabase();
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
// end-generated-section httpHooks

if (require.main === module) {
  initDatabase().catch((e) => {
    // tslint:disable-next-line no-console
    console.error(e);
    process.exit(1);
  });
  // tslint:disable-next-line no-console
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}
