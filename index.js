import { inspect } from "util";
import SocMeds from "./src/socmedurls.js";
import sendRequest from "./src/dataGetter.js";
import { Command } from "commander";
import packagejson from "./package.json" with { type: "json" };
import path from "path";
import logger from "./src/logger.js";
import colors from "./src/colors.js";
import fs from "fs";
import jsonfile from "jsonfile";

const program = new Command();
const outputPath = path.join(process.cwd(), "results");

program
  .name("kSearch")
  .description("An open-source OSINT tool to search for username profiles across multiple platforms.")
  .version(getVersion())
  .addHelpText("after", `
Developed by Kyle (@kyletechie) for ethical hacking and OSINT research purposes only.
This project was built entirely on an Android device using Termux.

If you'd like to support the development and help me get a laptop, consider donating:
https://www.paypal.me/KyleTilano
Thank you!`);

program
  .option("-u, --username <username>", "Target username to search for")
  .option("-t, --timeout <ms>", "Timeout per HTTP request in milliseconds (default: 0)", parseInt)
  .option("-o, --output <path>", "Results output path", outputPath)
  .option("-v, --verbose", "Enable verbose logging", false)
  .option("--only-live", "Show only platforms where the username exists", false)



  
program.parse()

const opts = program.opts();

function getVersion(){
  return /^\d+.\d+.\d+$/.test(packagejson.version) ? `v${packagejson.version}` : "v?.?.?";
}

async function main() {
  if (!opts.username) {
    logger.error("No username specified. Use -u or --username argument");
    process.exit(1);
  }

  if (opts.verbose) logger.info(`Starting scan for username: ${opts.username}`);

  const socmedurls = new SocMeds(opts.username);
  const allSocMeds = Object.values(socmedurls.getAll());

  if (opts.verbose) logger.info(`Loaded ${allSocMeds.length} platforms to scan.`);

  const results = await Promise.all(
    allSocMeds.map(async (sm) => {
      if (opts.verbose) logger.info(`Fetching ${sm.platform} → ${sm.url}`);

      try {
        const data = await sendRequest(sm.url, null, { timeout: opts.timeout });
        if (!data?.data){
          throw Error(`${data.emsg} ${data.status}`);
        }
        const info = sm.scraper ? sm.scraper(data.data) : "N/A";

        if (opts.verbose) logger.info(`[${sm.platform}] Response status: ${data.status} ${data.statusText}`);

        const result = {
          ...sm,
          status: data.status,
          statusText: data.statusText,
          info
        };

        const { url, platform, status, statusText } = result;

        if (status === 200) {
          console.log(`${colors.blue}[${platform}] ${colors.green}${colors.underscore}${url}${colors.reset} ${colors.green}(${statusText})`);
        } else if (!opts.onlyLive) {
          console.log(`${colors.blue}[${platform}] ${colors.red}${colors.underscore}${url}${colors.reset} ${colors.red}(${statusText})`);
        }

        return result;
      } catch (err) {
        if (opts.verbose) logger.warn(`Failed to fetch ${sm.platform}: ${err.message}`);
        return {
          ...sm,
          status: null,
          statusText: "Request Failed",
          info: "N/A"
        };
      }
    })
  );

  fs.mkdirSync(outputPath, { recursive: true });

  if (!fs.existsSync(opts.output) || !fs.statSync(opts.output).isDirectory()) {
    logger.warn("Invalid output path, using the default:", outputPath);
    opts.output = outputPath;
  }

  const fileName = path.join(opts.output, `${opts.username}.json`);
  const finalResults = opts.onlyLive ? results.filter(a => a.status === 200) : results;

  if (opts.verbose) logger.info(`Saving ${finalResults.length} result(s) to file: ${fileName}`);

  jsonfile.writeFileSync(fileName, finalResults, { spaces: 2 });

  logger.info(`Total websites scanned: ${results.length}. Results saved to: ${fileName}`);
}

main();

