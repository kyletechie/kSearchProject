import cheerio from "cheerio";
/*import sendRequest from "../src/dataGetter.js";
import fs from "fs";*/
import { selectByAttr } from "./utils.js";

function getName($){
  const name = selectByAttr($, "meta", {
    property: "og:title"
  }).attr("content")
  return name?.trim();
}

function getID($){
  const androidUrl = selectByAttr($, "meta", {
    property: "al:android:url"
  }).attr("content");
  const urlParts = androidUrl?.split("/");
  const id = urlParts ? urlParts[urlParts.length - 1] : null
  return id;
}

function getBio($){
  // BUG: Some accounts.. the bio is not in the og:description
  // XXX: Invalid bio:Facebook gives people the power to share and makes the world more open and
  if (!getLikes($) >= 0){
    // yung bio available lang sa mga professional mode accounts
    return;
  }
  const desc = selectByAttr($, "meta", {
    property: "og:description"
  }).attr("content");
  const descParts = desc?.split(".");
  console.log(descParts)
  const bio = descParts ? descParts[1]?.trim() : null
  return bio;
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
  return parseInt(likes);
}

function getNickname($){
  const name = getName($);
  const data = $.html();
  const nickname = data.match(new RegExp(`${name} \\(([^)]+)\\)`));
  if (nickname && nickname[1]){
    return nickname[1];
  }
}

function getCurrentCity($){
  const city = $("span.f1:contains('Lives in')").next().text();
  return city;
}

function getHometown($){
  const ht = $("span.f1:contains('From')").next().text();
  return ht;
}

function jobApplication($){
  // 🥀🥀🙏
  const job = $("span.f1:contains('Works at ')").next().text();
  return job?.trim();
}

function getCategory($){
  const category = $("span.f2:contains('Profile')").next().text();
  return category?.slice(3);
}

function getUniversity($){
  const studiedAt = $("span.f1:contains('Studied at ')").next().text();
  return studiedAt?.trim()?.replaceAll("\n", "");
}

function getHighschool($){
  const hs = $("span.f1:contains('Went to ')").next().text();
  return hs?.trim()?.replaceAll("\n", "");
}

function main(data){
  const $ = cheerio.load(data);
  if ($("title").text() === "Facebook"){
    // kung yung title ng html ay "Facebook" by default 
    // wala tayong makukuhang information sa target 
    // 
    // If the HTML title is "Facebook" by default
    // We have no information available to the target
    return {};
  }
  const name = getName($);
  const id = getID($);
  const bio = getBio($);
  const likes = getLikes($);
  const nickname = getNickname($);
  const currentCity = getCurrentCity($);
  const homeTown = getHometown($);
  const job = jobApplication($);
  const category = getCategory($);
  const university = getUniversity($);
  const school = getHighschool($);
  return {
    ...(name && { name }),
    ...(id && { id }),
    ...(bio && { bio }),
    ...(likes && { likes }),
    ...(nickname && { nickname }),
    ...(currentCity && { currentCity }),
    ...(homeTown && { homeTown }),
    ...(job && { job }),
    ...(category && { category }),
    ...(university && { university }),
    ...(school && { school })
  }
}

/*const { data } = await sendRequest("https://m.facebook.com/sanjuan.napoleonanthony");
console.log(main(data));
fs.writeFileSync("fba.prof.html", data);*/


//getLivesin(data)

export default main
