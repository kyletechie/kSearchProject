#!/usr/bin/env node

/*
 * Developer: Kyle Tilano (@kyletechie)
 * Project: kSearchProject
 * Description: An open-source OSINT tool to search for username profiles across multiple platforms.
 * Github: https://github.com/kyletechie/kSearchProject
 * License: MIT
*/

import SocMeds from "./src/socmedurls.js";
import sendRequest from "./src/dataGetter.js";
import { Command } from "commander";
import path from "path";
import logger from "./src/logger.js";
import colors from "./src/colors.js";
import fs from "fs";
import dataFormat from "./src/dataFormatter.js";
import gitUpdate from "./src/gitUpdater.js";
import dump2file from "./src/dump2file.js";
import { inspect } from "util";
import getVersion from "./src/version.js";
import isUpToDate from "./src/updateChecker.js";

const program = new Command();
const outputPath = path.join(process.cwd(), "results");
const outputFormats = ["json", "csv", "yaml", "txt"];

const repoStatus = await isUpToDate();

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
    "The username you want to search for (required)."
  )
  .option(
    "-t, --timeout <ms>",
    "Set how long (in milliseconds) to wait for each request before skipping. (default: 0 = wait forever)",
    parseInt
  )
  .option(
    "-o, --output <dir>",
    "Folder to save the scan results to.",
    outputPath
  )
  .option(
    `-of, --output-format <${outputFormats.join("|")}>`,
    `Choose the file format to save your results in. (formats: ${outputFormats.join(", ")}).`,
    "json"
  )
  .option(
    "-v, --verbose",
    "Show detailed logs of what the tool is doing, including each HTTP request."
  )
  .option(
    "--update",
    "Update kSearch to the latest version."
  );

program.parse()

const opts = program.opts();

async function main() {
  if (opts.verbose && repoStatus.uptodate){
    logger.info(repoStatus.message);
  }
  if (!repoStatus.uptodate){
    logger.warn(repoStatus.message);
    logger.warn(`local: ${colors.red}${repoStatus.localHash}`);
    logger.warn(`remote: ${colors.green}${repoStatus.remoteHash}`);
  }
  if (opts.update){
    await gitUpdate();
    process.exit(0);
  }
  if (!opts.username) {
    logger.error("No username specified. Use -u or --username argument");
    logger.info("Example: kSearch -u johndoe");
    program.help();
  }
  if (!outputFormats.includes(opts.outputFormat)){
    logger.error(`"${opts.outputFormat}" is not a supported output format. (supported formats: ${outputFormats.join(", ")})`);
    process.exit(1);
  }

  logger.info(`${colors.yellow}kSearch ${getVersion()} ${colors.white}— scanning ${colors.green}"${opts.username}"`);
  if (opts.verbose) logger.verbose(`Options: ${inspect(opts, { colors: true })}`);

  const socmedurls = new SocMeds(opts.username);
  const allSocMeds = Object.values(socmedurls.getAll());

  logger.info(`Loaded ${colors.yellow}${allSocMeds.length}${colors.white} platforms to scan.`);

  const results = await Promise.all(
    allSocMeds.map(async (sm) => {
      try {
        if (opts.verbose) logger.verbose(`${colors.blue}GET ${colors.yellow}(${sm.platform}) ${colors.underscore + colors.green}${sm.url}${colors.reset}`);
        const data = await sendRequest(sm.url, null, { timeout: opts.timeout });
        if (!data?.data || data?.status !== 200){
          const err = new Error("HTTP Request");
          err.message = data.emsg || "No Response";
          err.status = data.status || data.statusText;
          throw err;
        }
        const accountInfo = sm.scraper ? sm.scraper(data.data) : null;

        const result = {
          ...sm,
          status: data.status,
          statusText: data.statusText,
          ...accountInfo
        };

        const { url, platform, status, statusText } = result;

        logger.info(`${colors.blue}(${platform}) ${colors.green}${colors.underscore}${url}${colors.reset} ${colors.green}(${status} ${statusText})${colors.reset}`);

        if (accountInfo){
          dataFormat(accountInfo, 1, sm.platform);
        }

        return result;
      } catch (err) {
        if (opts.verbose) logger.verbose(`${colors.yellow}(${sm.platform}) ${colors.red}${sm.url}: ${colors.white}${err.message} ${colors.yellow}(${err.status})`);
        return {
          ...sm,
          errorMessage: err.message,
          statusText: err.status,
        };
      }
    })
  );

  fs.mkdirSync(outputPath, { recursive: true });

  if (!fs.existsSync(opts.output) || !fs.statSync(opts.output).isDirectory()) {
    logger.warn(`Invalid output path, using the default: ${colors.underscore + colors.green}${outputPath}${colors.reset}`);
    opts.output = outputPath;
  }

  const fileName = path.join(opts.output, `${opts.username}.${opts.outputFormat}`);
  const finalResults = results.filter(a => a.status === 200).map((v) => {
    delete v.scraper
    return v;
  });

  dump2file(fileName, finalResults);

  if (opts.verbose) logger.verbose(`Saving ${colors.yellow}${finalResults.length} result(s)${colors.reset} to file: ${colors.underscore + colors.green}${fileName}${colors.reset}`);

  /*logger.info(`${colors.red}${results.length - finalResults.length}${colors.reset} sites not found.`);
  logger.info(`${colors.yellow}${finalResults.length}${colors.reset} sites found → ${colors.green}${colors.underscore}${fileName}${colors.reset}`);*/

  logger.info(`${colors.yellow}${finalResults.length} site(s)${colors.reset} saved to ${colors.green}${colors.underscore}${fileName}${colors.reset}. ${colors.red}${results.length - finalResults.length} site(s)${colors.reset} not found.`);
}

main();

