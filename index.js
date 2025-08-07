#!/usr/bin/env node

import SocMeds from "./src/socmedurls.js";
import sendRequest from "./src/dataGetter.js";
import { Command } from "commander";
import packagejson from "./package.json" with { type: "json" };
import path from "path";
import logger from "./src/logger.js";
import colors from "./src/colors.js";
import fs from "fs";
import jsonfile from "jsonfile";
import dataFormat from "./src/dataFormatter.js";
import gitUpdate from "./src/gitUpdater.js";

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
  .option(
    "-u, --username <username>",
    "Target username to search for across supported platforms (required)"
  )
  .option(
    "-t, --timeout <ms>",
    "Maximum time to wait for each HTTP request in milliseconds (default: 0 = no timeout)",
    parseInt
  )
  .option(
    "-o, --output <dir>",
    "Directory to save the scan results",
    outputPath
  )
  .option(
    "-v, --verbose",
    "Enable detailed logging of requests and responses"
  )
  .option(
    "--update",
    "Update the kSearch tool"
  );

program.parse()

const opts = program.opts();

function getVersion(){
  return /^\d+.\d+.\d+$/.test(packagejson.version) ? `v${packagejson.version}` : "v?.?.?";
}

async function main() {
  if (opts.update){
    await gitUpdate();
  }
  if (!opts.username) {
    logger.error("No username specified. Use -u or --username argument");
    logger.info("Example: kSearch -u johndoe");
    program.help();
  }

  logger.info(`kSearch ${colors.yellow}${getVersion()} ${colors.white}— scanning ${colors.green}"${opts.username}"`);

  const socmedurls = new SocMeds(opts.username);
  const allSocMeds = Object.values(socmedurls.getAll());

  if (opts.verbose) logger.info(`Loaded ${colors.yellow}${allSocMeds.length}${colors.white} platforms to scan.`);

  const results = await Promise.all(
    allSocMeds.map(async (sm) => {
      try {
        if (opts.verbose) logger.info(`${colors.blue}GET ${colors.yellow}(${sm.platform}) ${colors.underscore + colors.green}${sm.url}${colors.reset}`);
        const data = await sendRequest(sm.url, null, { timeout: opts.timeout });
        if (!data?.data || data?.status !== 200){
          const err = new Error("HTTP Request");
          err.message = data.emsg || "No Response";
          err.status = data.status || data.statusText;
          throw err;
        }
        const accountInfo = sm.scraper ? sm.scraper(data.data) : "N/A";

        const result = {
          ...sm,
          status: data.status,
          statusText: data.statusText,
          accountInfo
        };

        const { url, platform, status, statusText } = result;

        logger.info(`${colors.blue}(${platform}) ${colors.green}${colors.underscore}${url}${colors.reset} ${colors.green}(${status} ${statusText})${colors.reset}`);

        if (accountInfo !== "N/A"){
          dataFormat(accountInfo, 1, sm.platform);
        }

        return result;
      } catch (err) {
        if (opts.verbose) logger.error(`${colors.yellow}(${sm.platform}) ${colors.red}${sm.url}: ${colors.white}${err.message} ${colors.yellow}(${err.status})`);
        return {
          ...sm,
          errorMessage: err.message,
          statusText: err.status,
          accountInfo: "N/A"
        };
      }
    })
  );

  fs.mkdirSync(outputPath, { recursive: true });

  if (!fs.existsSync(opts.output) || !fs.statSync(opts.output).isDirectory()) {
    logger.warn(`Invalid output path, using the default: ${colors.underscore + colors.green}${outputPath}${colors.reset}`);
    opts.output = outputPath;
  }

  const fileName = path.join(opts.output, `${opts.username}.json`);
  const finalResults = results.filter(a => a.status === 200);

  if (opts.verbose) logger.info(`Saving ${colors.yellow}${finalResults.length} result(s)${colors.reset} to file: ${colors.underscore + colors.green}${fileName}${colors.reset}`);

  jsonfile.writeFileSync(fileName, finalResults, { spaces: 2 });

  /*logger.info(`${colors.red}${results.length - finalResults.length}${colors.reset} sites not found.`);
  logger.info(`${colors.yellow}${finalResults.length}${colors.reset} sites found → ${colors.green}${colors.underscore}${fileName}${colors.reset}`);*/
  logger.info(`Found ${colors.yellow}${finalResults.length}${colors.reset} sites → saved to ${colors.green}${colors.underscore}${fileName}${colors.reset}, ${colors.red}${results.length - finalResults.length}${colors.reset} not found.`);
}

main();

