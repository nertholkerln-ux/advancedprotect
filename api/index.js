import fs from "fs-extra";
import path from "path";
const __dirname = path.resolve();

export default async function handler(req, res) {
  const html = await fs.readFile(path.join(__dirname, "public", "index.html"), "utf8");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}
