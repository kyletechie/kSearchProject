import { fileURLToPath } from "url";
import path from "path";
import { simpleGit } from "simple-git";
import logger from "./logger.js";
import colors from "./colors.js";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "..");

const git = simpleGit(__dirname);

async function updateRepo(){
  try {
    logger.info(`Checking for repository updates...`);
    const status = await git.pull();
    if (status.summary.changes === 0) {
      logger.info(`No updates detected. kSearch is already up to date.`);
    } else {
      const log = await git.log(['-1']);
      const commitMessage = log.latest.message;
      const commitHash = log.latest.hash;
      const commitDate = new Date(log.latest.date).toLocaleString();
      const authorName = log.latest.author_name;
      const authorEmail = log.latest.author_email;
      execSync("npm install", { stdio: "inherit" });
      logger.info(`${colors.magenta}(${commitHash})${colors.white}: ${colors.green}${commitMessage} ${colors.white}> ${colors.green}${authorName} ${colors.yellow}<${authorEmail}> ${colors.blue}(${commitDate})`);
      logger.info(`${colors.yellow}kSearch${colors.reset} is Successfully updated.`);
      process.exit(0);
    }
  } catch (e) {
    logger.error("Update Failed:", e.message);
    process.exit(1);
  }
}

export default updateRepo;
