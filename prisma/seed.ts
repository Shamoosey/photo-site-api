import prisma from "./client";
import { CollectionName } from "../src/api/v1/types/CollectionName";

const unsplashPool = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946",
  "https://images.unsplash.com/photo-1494548162494-384bba4ab999",
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
  "https://images.unsplash.com/photo-1445307806294-bff7f67ff225",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5",
];

function buildImageUrl(baseUrl: string): string {
  return `${baseUrl}?auto=format&fit=crop&w=1200&q=80`;
}

function randomCloudinaryId(): string {
  return `seed/${Math.random().toString(36).slice(2, 10)}`;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const captions = [
  "Golden hour glow",
  "Quiet morning light",
  "Urban geometry",
  "Wanderlust vibes",
  "Textures of nature",
  "Minimal composition",
  "City after rain",
  "Mountain air",
  "Still life study",
  "Ocean horizon",
  "Streetlife candid",
  "Warm tones",
  "Cool blues",
  "Architectural lines",
  "Sunset silhouette",
];

async function main() {
  console.log("🌱 Starting seed...");

  // Clean existing data (respects FK order)
  await prisma.imageCollection.deleteMany();
  await prisma.image.deleteMany();
  await prisma.collection.deleteMany();

  const collectionsData = [
    {
      name: CollectionName.Home,
      description: "Scenic views, mountains, and far-off places worth remembering.",
    },
    {
      name: "Urban & Architecture",
      description: "City streets, skylines, and structural details.",
    },
    {
      name: "Minimal & Abstract",
      description: "Clean compositions, textures, and abstract visual moments.",
    },
  ];

  for (const data of collectionsData) {
    const collection = await prisma.collection.create({ data });
    console.log(`📁 Created collection: ${collection.name}`);

    const imageCount = randomInt(10, 20);
    const pickedUrls = shuffle(unsplashPool).slice(0, imageCount);

    for (const baseUrl of pickedUrls) {
      const image = await prisma.image.create({
        data: {
          imageUrl: buildImageUrl(baseUrl),
          cloudinaryId: randomCloudinaryId(),
          caption: captions[randomInt(0, captions.length - 1)],
          metaData: "unsplash seeded image",
        },
      });

      await prisma.imageCollection.create({
        data: {
          collectionId: collection.id,
          imageId: image.id,
        },
      });
    }

    console.log(`   ↳ Added ${imageCount} images to "${collection.name}"`);
  }

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
