// to build the
// pkg Wallpaper-Stealer/app.ts --output app.exe --icon /favicon.ico
import { readdirSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import sharp from "sharp";

const sourceFolder =
  "C:\\Users\\munat\\AppData\\Local\\Packages\\Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy\\LocalState\\Assets";
const targetFolder = join(__dirname, "Wallpapers");

// Ensure the target folder exists or create it
if (!existsSync(targetFolder)) mkdirSync(targetFolder);

// Function to check if an image has a resolution of 1920x1080
const is1920x1080 = async (filePath: string): Promise<boolean | null> => {
  try {
    const { width, height } = await sharp(filePath).metadata();
    return width === 1920 && height === 1080;
  } catch (error) {
    console.error(`Error reading metadata for ${filePath}:`, error);
    return null;
  }
};

// Function to copy images that meet the resolution criteria
const processImages = async (): Promise<void> => {
  const files = readdirSync(sourceFolder);

  for (const file of files) {
    const sourcePath = join(sourceFolder, file);
    const targetPath = join(targetFolder, `${file}.jpg`);

    // Check if the target file already exists
    if (!existsSync(targetPath)) {
      const metadata = await is1920x1080(sourcePath);

      if (metadata !== null && metadata) {
        try {
          // Copy the file with a .jpg extension
          await sharp(sourcePath).toFile(targetPath);
        } catch (error) {
          console.error(`Error copying file ${file}:`, error);
        }
      } else if (metadata === null) {
        console.error(`Failed to read metadata for ${sourcePath}`);
      }
    }
  }
};

await processImages();
