import axios from "axios";
import { randomUUID } from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: "Missing code" });

  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({ error: "Server missing GitHub token" });

  try {
    const id = randomUUID();
    const response = await axios.post(
      "https://api.github.com/gists",
      {
        files: { [`${id}.lua`]: { content: text } },
        public: false,
        description: "MonLuaProtector Gist"
      },
      {
        headers: { Authorization: `token ${token}` }
      }
    );

    const gistId = response.data.id;
    const rawLink = `${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}/raw/${gistId}`;
    res.json({ id: gistId, raw: rawLink });
  } catch (err) {
    console.error("Gist upload failed:", err.message);
    res.status(500).json({ error: "Failed to upload to Gist" });
  }
}
