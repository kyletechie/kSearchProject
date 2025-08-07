import fs from "fs";
import path from "path";
import logger from "./logger.js";
import colors from "./colors.js";

function dumpHtml(resultDir, username, platform, status, data, verbose) {
  const formattedPlatform = platform.toLowerCase().split(" ").join("-");
  const htmlDumpsDir = path.resolve(resultDir, `${username}.html.dumps`);
  
  if (!fs.existsSync(htmlDumpsDir)) {
    fs.mkdirSync(htmlDumpsDir, { recursive: true });
  }

  const filePath = path.join(htmlDumpsDir, `${username}.${formattedPlatform}.${status}.html`);
  
  if (verbose) {
    logger.verbose(`Saving HTML dump to: ${colors.green + colors.underscore}${filePath}${colors.reset}`);
  }

  try {
    fs.writeFileSync(filePath, data, "utf8");
    if (verbose) logger.verbose(`Successfully saved HTML dump to ${colors.green + colors.underscore}${filePath}${colors.reset}`);
  } catch (error) {
    logger.error(`Failed to save HTML dump to ${filePath}: ${error.message}`);
  }
}

export default dumpHtml;
