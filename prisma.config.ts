import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "prisma/config";

function loadEnvFile(filename: string) {
  const fullPath = path.join(__dirname, filename);
  if (!fs.existsSync(fullPath)) {
    return;
  }

  const lines = fs.readFileSync(fullPath, "utf8").split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    if (!key || process.env[key]) {
      continue;
    }

    let value = line.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});
