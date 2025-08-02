import cheerio from "cheerio";
import sendRequest from "../src/dataGetter.js";
import { selectByAttr } from "./utils.js";

function getName($){
  const name = selectByAttr($, "meta", {
    property: "og:title"
  }).attr("content")
  return name?.trim() || "N/A";
}

function getID($){
  const androidUrl = selectByAttr($, "meta", {
    property: "al:android:url"
  }).attr("content");
  const urlParts = androidUrl?.split("/");
  const id = urlParts ? urlParts[urlParts.length - 1] : null
  return id || "N/A"
}

function getBio($){
  // BUG: Some accounts.. the bio is not in the og:description
  // XXX: Invalid bio:Facebook gives people the power to share and makes the world more open and
  const desc = selectByAttr($, "meta", {
    property: "og:description"
  }).attr("content");
  const descParts = desc?.split(".");
  const bio = descParts ? descParts[2]?.trim() : null
  return bio || "N/A";
}

function getLikes($){
  const desc = selectByAttr($, "meta", {
    property: "og:description"
  }).attr("content")
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
  // TODO: i don't think getting followers is possible
  const f = data.match(/"(\S+)\s+followers"/);
  console.log(f);
}

function getLivesin(data){
  // TODO: lmao
  const l = data.match(/<span*>Lives in<\/span><span*>([^<]+)<\/span>/);
  console.log(l)
}

async function main(url){
  const { data } = await sendRequest(url);
  const $ = cheerio.load(data);
  const name = getName($);
  const id = getID($);
  const bio = getBio($);
  const likes = getLikes($);
  const nickname = getNickname($);
  return {
    name,
    id,
    bio,
    likes,
    nickname
  }
}

//getLivesin(data)

export default main
