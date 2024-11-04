import { readdirSync, mkdirSync, existsSync, unlinkSync } from "fs";
import { join } from "path";
import sharp from "sharp";

const sourceFolder =
  "C:\\Users\\munat\\AppData\\Local\\Packages\\Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy\\LocalState\\Assets";
const targetFolder = join(__dirname, "images");

// Ensure the target folder exists or create it
if (!existsSync(targetFolder)) mkdirSync(targetFolder);

// Function to check if an image has a resolution of 1920x1080
const is1920x1080 = async (filePath: string): Promise<boolean> => {
  try {
    const { width, height } = await sharp(filePath).metadata();
    return width === 1920 && height === 1080;
  } catch (error) {
    console.error(`Error reading metadata for ${filePath}:`, error);
    return false;
  }
};

// Function to copy images that meet the resolution criteria
const processImages = async (): Promise<void> => {
  const files = readdirSync(sourceFolder);

  for (const file of files) {
    const sourcePath = join(sourceFolder, file);
    const targetPath = join(targetFolder, `${file}.jpg`);

    try {
      // Check if the image has the correct resolution before copying
      if (await is1920x1080(sourcePath)) {
        // Copy the file with a .jpg extension
        sharp(sourcePath).toFile(targetPath);
        console.log(`File ${file} copied successfully.`);
      } else {
        console.log(
          `File ${file} skipped (does not meet resolution criteria).`
        );
      }
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }
  }
};

processImages()
  .then(() => console.log("File processing completed."))
  .catch((error) => console.error("An error occurred:", error));
