import simpleGit from 'simple-git';
import logger from "./logger.js";
import colors from './colors.js';
import getVersion from "./version.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "..");

const git = simpleGit(__dirname);

async function getLatestVersion(){
  const status = await git.status();
  const branch = status.current;
  const latestPackageContent = await git.show([
    `origin/${branch}:package.json`
  ]);
  const _package = JSON.parse(latestPackageContent);
  return "v" + _package.version;
}

async function isUpToDate() {
  try{
    const status = await git.status();
    const branch = status.current;
    const localHash = await git.revparse([branch]);
    const remoteHash = await git.revparse([`origin/${branch}`]);

    if (localHash === remoteHash) {
      const message = `${colors.yellow}kSearch ${getVersion()}${colors.white} is up to date.`;
      return {
        uptodate: true,
        message 
      }
    } else {
      const latestVersion = await getLatestVersion();
      const message = `${colors.yellow}kSearch${colors.white} is not up to date. current: ${colors.red}${getVersion()} ${colors.white}> latest: ${colors.green}${latestVersion}`;
      return {
        uptodate: false,
        message,
        localHash,
        remoteHash,
        latestVersion
      }
    }
  } catch(e){
    logger.error(`Failed to check update status: ${e.message}`);
  }
}

export default isUpToDate;
