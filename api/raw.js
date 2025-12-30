import axios from "axios";

export default async function handler(req, res) {
  const ua = (req.headers["user-agent"] || "").toLowerCase();
  const id = req.url.split("/").pop().split("?")[0];

  if (!ua.includes("roblox")) {
    res.status(403).send("PROTECTED BY MON LUA PROTECTOR");
    return;
  }

  try {
    const gistUrl = `https://api.github.com/gists/${id}`;
    const response = await axios.get(gistUrl);
    const files = response.data.files;
    const file = Object.values(files)[0];
    const code = file.content;

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send(code);
  } catch (err) {
    res.status(404).send("Not found or deleted");
  }
}
