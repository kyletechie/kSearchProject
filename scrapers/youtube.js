import cheerio from "cheerio";
import { selectByAttr } from "./utils.js";

// test gitUpdater

function getName($){
  const name = selectByAttr($, "meta", {
    itemprop: "name"
  }).attr("content");
  return name || "N/A";
}

function getChannelID($){
  const channelId = selectByAttr($, "meta", {
    itemprop: "identifier"
  }).attr("content");
  return channelId || "N/A";
}

function getBio($){
  const bio = selectByAttr($, "meta", {
    itemprop: "description"
  }).attr("content");
  return bio || "N/A";
}

function main(data){
  const $ = cheerio.load(data);
  const name = getName($);
  const bio = getBio($);
  const channelId = getChannelID($);
  return {
    name,
    bio,
    channelId
  }
}

export default main
