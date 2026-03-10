import fs from "node:fs";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

function loadEnvFile(filename: string) {
  const fullPath = path.join(process.cwd(), filename);
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

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const templates = [
  {
    key: "atlas",
    name: "Atlas",
    description:
      "A clean, structured layout with clear section headers and professional spacing. Best for traditional industries.",
    isActive: true,
    displayOrder: 1,
    version: 1,
    metadataJson: {
      preview: "/templates/atlas-preview.png",
      tags: ["professional", "clean", "traditional"],
    },
    layoutConfigJson: {
      headerStyle: "centered",
      sectionDivider: "line",
      accentPosition: "left-border",
      columns: 1,
    },
  },
  {
    key: "summit",
    name: "Summit",
    description:
      "A modern two-column design that maximizes space efficiency. Great for candidates with extensive experience.",
    isActive: true,
    displayOrder: 2,
    version: 1,
    metadataJson: {
      preview: "/templates/summit-preview.png",
      tags: ["modern", "two-column", "space-efficient"],
    },
    layoutConfigJson: {
      headerStyle: "left-aligned",
      sectionDivider: "space",
      accentPosition: "sidebar",
      columns: 2,
    },
  },
  {
    key: "quill",
    name: "Quill",
    description:
      "An elegant, minimalist layout with refined typography and generous whitespace. Ideal for creative professionals.",
    isActive: true,
    displayOrder: 3,
    version: 1,
    metadataJson: {
      preview: "/templates/quill-preview.png",
      tags: ["elegant", "minimalist", "creative"],
    },
    layoutConfigJson: {
      headerStyle: "left-aligned",
      sectionDivider: "subtle-line",
      accentPosition: "inline",
      columns: 1,
    },
  },
  {
    key: "northstar",
    name: "Northstar",
    description:
      "A bold, contemporary design with strong visual hierarchy. Perfect for tech and startup roles.",
    isActive: true,
    displayOrder: 4,
    version: 1,
    metadataJson: {
      preview: "/templates/northstar-preview.png",
      tags: ["bold", "contemporary", "tech"],
    },
    layoutConfigJson: {
      headerStyle: "banner",
      sectionDivider: "accent-block",
      accentPosition: "top-bar",
      columns: 1,
    },
  },
];

async function seed() {
  console.log("Seeding templates...");

  for (const template of templates) {
    await prisma.template.upsert({
      where: { key: template.key },
      update: {
        name: template.name,
        description: template.description,
        isActive: template.isActive,
        displayOrder: template.displayOrder,
        version: template.version,
        metadataJson: template.metadataJson,
        layoutConfigJson: template.layoutConfigJson,
      },
      create: template,
    });
    console.log(`  Seeded template: ${template.name}`);
  }

  console.log("Seed complete.");
}

seed()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
