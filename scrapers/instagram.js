import cheerio from "cheerio";
import fs from "fs";
import { selectByAttr } from "./utils.js";
import sendRequest from "../src/dataGetter.js";

function getName($){
  const data = $.html();
  const name = data.match(/"full_name":"([^"]+)"/);
  return name[1] || "N/A";
}

function isPrivate($){
  const data = $.html();
  const isPrivate = data.match(/"is_private":([^,]+),/);
  return isPrivate === "true";
}

function getBioLinks($){
  try{
    const data = $.html();
    const bioLinks = data.match(/"bio_links":\[([^\]]*)\]/);
    const bioLinksObj = JSON.parse(`[${bioLinks[1]}]`).filter(a => a.url)
    let results = [];
    for (let i = 0; i < bioLinksObj.length; i++){
      const { url, title } = bioLinksObj[i];
      results.push({ url, title })
    }
    return results;
  } catch(e){
    return {
      emsg: e.message
    }
  }
}

function getFFP($){
  try{
    const ffp = selectByAttr($, "meta", {
      property: "og:description"
    }).attr("content");
    let formattedFFPArr;
    let ffpObject = {};
    if (ffp){
      formattedFFPArr = ffp.split("-")[0]?.split(" ")?.filter(Boolean);
    }
    for (let i = 0; i < formattedFFPArr.length; i+= 2){
      const valAfter = formattedFFPArr[i + 1];
      console.log(valAfter)
      //ffpObject[valAfter === "Posts" ? valAfter : valAfter.slice(0, -1)] = formattedFFPArr[i];
    }
    return (ffpObject);
  } catch(e){
    return { "Followers": 0, "Following": 0, "Posts": 0, emsg: e.message };
  }
}

async function main(url){
  const { data } = await sendRequest(url);
  fs.writeFileSync("instagram", data);
  const $ = cheerio.load(data);
  const name = getName($);
  const privae = isPrivate($);
  getBioLinks($)
  /*
  return {
    name,
    g: getFFP($)
  }*/
}

const test = await main("https://instagram.com/kairudev");
console.log(test);

