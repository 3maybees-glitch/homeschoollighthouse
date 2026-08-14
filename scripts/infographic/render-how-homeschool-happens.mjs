import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const html = path.join(root, "how-homeschool-happens.html");
const out = path.resolve(root, "../../public/social/how-homeschool-happens-x-infographic.png");

mkdirSync(path.dirname(out), { recursive: true });

const chrome =
  process.env.CHROME_PATH ||
  "/usr/bin/google-chrome-stable";

const args = [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-sandbox",
  "--font-render-hinting=none",
  "--force-device-scale-factor=1",
  "--allow-file-access-from-files",
  "--window-size=1024,1536",
  `--screenshot=${out}`,
  "--default-background-color=00000000",
  "--virtual-time-budget=8000",
  pathToFileURL(html).href,
];

const child = spawn(chrome, args, { stdio: "inherit" });
child.on("exit", (code) => {
  if (code !== 0) {
    console.error(`Chrome exited with ${code}`);
    process.exit(code ?? 1);
  }
  console.log(`Wrote ${out}`);
});
