import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";

const data = fs.readFileSync("facebook3.log", "utf8");

function getName(data){
  const $ = cheerio.load(data);
  const name = $('meta[property="og:title"]').attr("content");
  return name?.trim() || "N/A";
}

function getID(data){
  const $ = cheerio.load(data);
  const androidUrl = $('meta[property="al:android:url"]').attr("content");
  const urlParts = androidUrl?.split("/");
  const id = urlParts ? urlParts[urlParts.length - 1] : null
  return id || "N/A"
}

function getBio(data){
  const $ = cheerio.load(data);
  // BUG: Some accounts.. the bio is not in the og:description
  // XXX: Invalid bio:Facebook gives people the power to share and makes the world more open and
  const desc = $('meta[property="og:description"]').attr("content");
  const descParts = desc?.split(".");
  const bio = descParts ? descParts[2]?.trim() : null
  return bio || "N/A";
}

function getLikes(data){
  const $ = cheerio.load(data);
  const desc = $('meta[property="og:description"]').attr("content");
  const descParts = desc?.split(".");
  let likes = descParts ? descParts[1]?.split("likes")[0]?.trim() : null
  if (likes?.includes(",")){
    likes = likes?.split(",")?.join("");
  }
  return parseInt(likes) || "N/A";
}

function getNickname(data){
  const name = getName(data);
  const nickname = data.match(new RegExp(`${name} \\(([^)]+)\\)`));
  if (nickname && nickname[1]){
    return nickname[1];
  }
  return "N/A";
}

function getFollowers(data){
  const f = data.match(/"(\S+)\s+followers"/);
  console.log(f);
}

function getLivesin(data){
  const l = data.match(/<span*>Lives in<\/span><span*>([^<]+)<\/span>/);
  console.log(l)
}

function main(data){
  const name = getName(data);
  const id = getID(data);
  const bio = getBio(data);
  const likes = getLikes(data);
  const nickname = getNickname(data);
  return {
    name,
    id,
    bio,
    likes,
    nickname
  }
}

console.log(main(data))

getLivesin(data)

export default main
