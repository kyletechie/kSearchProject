import sendRequest from "../src/dataGetter.js";
import fs from "fs";
import cheerio from "cheerio";

const url = "https://m.youtube.com/@kairudev";

const { data } = await sendRequest(url);

const $ = cheerio.load(data);

function getName($){
  const name = $('meta[property="og:title"]').attr("content");
  return name || "N/A";
}

function getChannelID($){
  const link = $("link")
}

function getBio($){
  const bio = $('meta[name="description"]').attr("content");
  return bio || "N/A";
}

fs.writeFileSync("youtube", data);


