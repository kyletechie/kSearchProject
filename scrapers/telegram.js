/*import fs from "fs";
import sendRequest from "../src/dataGetter.js";*/
import cheerio from "cheerio";
import { selectByAttr } from "./utils.js";

function getName($){
  const name = selectByAttr($, "meta", {
    property: "og:title"
  }).attr("content");
  return name || "N/A";
}

function getBio($){
  const bio = selectByAttr($, "meta", {
    property: "og:description"
  }).attr("content");
  return bio || "N/A";
}

function main(data){
  const $ = cheerio.load(data);
  const name = getName($);
  const bio = getBio($);
  return {
    name,
    bio
  }
}

/*const { data } = await sendRequest("https://t.me/kairudev");
console.log(main(data))
fs.writeFileSync("telegram.html", data);*/

export default main;
