import prisma from "./client";

const cloudinaryPool = [
  "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  "https://res.cloudinary.com/demo/image/upload/cld-sample.jpg",
  "https://res.cloudinary.com/demo/image/upload/cld-sample-2.jpg",
  "https://res.cloudinary.com/demo/image/upload/cld-sample-3.jpg",
  "https://res.cloudinary.com/demo/image/upload/cld-sample-4.jpg",
  "https://res.cloudinary.com/demo/image/upload/cld-sample-5.jpg",
  "https://res.cloudinary.com/demo/image/upload/samples/landscapes/beach-boat.jpg",
  "https://res.cloudinary.com/demo/image/upload/samples/landscapes/nature-mountains.jpg",
  "https://res.cloudinary.com/demo/image/upload/samples/landscapes/girl-urban-view.jpg",
  "https://res.cloudinary.com/demo/image/upload/samples/landscapes/architecture-signs.jpg",
  "https://res.cloudinary.com/demo/image/upload/samples/people/bicycle.jpg",
  "https://res.cloudinary.com/demo/image/upload/samples/people/boy-snow-hoodie.jpg",
  "https://res.cloudinary.com/demo/image/upload/samples/people/jazz.jpg",
  "https://res.cloudinary.com/demo/image/upload/samples/people/kitchen-bar.jpg",
  "https://res.cloudinary.com/demo/image/upload/samples/people/smiling-man.jpg",
  "https://res.cloudinary.com/demo/image/upload/samples/animals/cat.jpg",
  "https://res.cloudinary.com/demo/image/upload/samples/animals/three-dogs.jpg",
  "https://res.cloudinary.com/demo/image/upload/samples/animals/reindeer.jpg",
  "https://res.cloudinary.com/demo/image/upload/samples/food/pot-mussels.jpg",
  "https://res.cloudinary.com/demo/image/upload/samples/food/spices.jpg",
  "https://res.cloudinary.com/demo/image/upload/samples/food/fish-vegetables.jpg",
  "https://res.cloudinary.com/demo/image/upload/samples/food/dessert.jpg",
  "https://res.cloudinary.com/demo/image/upload/samples/balloons.jpg",
  "https://res.cloudinary.com/demo/image/upload/samples/coffee.jpg",
];

const albumNames = ["Coastal Mornings", "City Wanderings", "Mountain Escapes", "Quiet Moments", "Autumn Textures"];

const albumDescriptions: Record<string, string> = {
  "Coastal Mornings": "Early light along the shoreline, salt air and slow tides.",
  "City Wanderings": "Streets, angles, and the rhythm of urban life.",
  "Mountain Escapes": "Thin air, wide views, and quiet trails.",
  "Quiet Moments": "Small, still scenes worth pausing for.",
  "Autumn Textures": "Warm color and changing light through the season.",
};

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

async function main() {
  console.log("Starting seed...");

  // Clear existing data. AlbumImage rows cascade-delete when their
  // parent Image/Album is removed, but we clear explicitly for clarity
  // and correct ordering.
  await prisma.albumImage.deleteMany();
  await prisma.album.deleteMany();
  await prisma.image.deleteMany();

  // --- Create a pool of standalone images ---
  const imageCount = randomInt(15, 25);
  const pickedUrls = shuffle([...cloudinaryPool, ...cloudinaryPool]).slice(0, imageCount);

  const createdImages = [];
  for (const baseUrl of pickedUrls) {
    const image = await prisma.image.create({
      data: {
        imageUrl: buildImageUrl(baseUrl),
        publicId: randomCloudinaryId(),
        caption: captions[randomInt(0, captions.length - 1)],
        sortOrder: randomInt(1, 100),
        metaData: "unsplash seeded image",
      },
    });
    createdImages.push(image);
  }
  console.log(`Added ${createdImages.length} images.`);

  let albumImageLinkCount = 0;
  let defaultAssigned = false;
  for (const name of albumNames) {
    const coverBaseUrl = cloudinaryPool[randomInt(0, cloudinaryPool.length - 1)];

    const album = await prisma.album.create({
      data: {
        name,
        defaultAlbum: !defaultAssigned,
        description: albumDescriptions[name] ?? "A curated collection of photos.",
        coverImageUrl: buildImageUrl(coverBaseUrl),
        coverImagePublicId: randomCloudinaryId(),
      },
    });

    defaultAssigned = true;
    const shuffledImages = shuffle(createdImages);
    const albumImageCount = randomInt(20, 60);
    const imagesForAlbum = shuffledImages.slice(0, albumImageCount);

    for (const image of imagesForAlbum) {
      await prisma.albumImage.create({
        data: {
          albumId: album.id,
          imageId: image.id,
        },
      });
      albumImageLinkCount++;
    }

    console.log(`Created album "${name}" with ${imagesForAlbum.length} images.`);
  }

  console.log(
    `Seed complete! ${createdImages.length} images, ${albumNames.length} albums, ${albumImageLinkCount} album-image links.`,
  );
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
