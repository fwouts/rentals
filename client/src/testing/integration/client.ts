import axios from "axios";

const URL = "http://localhost:3020";

export async function resetDatabase(): Promise<void> {
  const url = `${URL}/reset`;
  await axios({
    url,
    method: "POST",
  });
}
