import cheerio from "cheerio";
import { selectByAttr } from "./utils.js";

function getName($){
  const name = selectByAttr($, "meta", {
    itemprop: "name"
  }).attr("content");
  return name;
}

function getChannelID($){
  const channelId = selectByAttr($, "meta", {
    itemprop: "identifier"
  }).attr("content");
  return channelId;
}

function getBio($){
  const bio = selectByAttr($, "meta", {
    itemprop: "description"
  }).attr("content");
  return bio;
}

function main(data){
  const $ = cheerio.load(data);
  const name = getName($);
  const bio = getBio($);
  const channelId = getChannelID($);
  return {
    ...(name && { name }),
    ...(bio && { bio }),
    ...(channelId && { channelId })
  }
}

export default main
