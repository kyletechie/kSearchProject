import sendRequest from "../src/dataGetter.js";
import fs from "fs";
import cheerio from "cheerio";
import { selectByAttr } from "./utils.js";

const url = "https://m.youtube.com/@kairudev";

const { data } = await sendRequest(url);

const $ = cheerio.load(data);

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

function ytInitialData(){
  const ytInitialData = data.split("ytInitialData = '")[1].split("';")[0];
  console.log(JSON.parse(eval(`"${ytInitialData}"`)));
}

ytInitialData()

fs.writeFileSync("youtube", data);


