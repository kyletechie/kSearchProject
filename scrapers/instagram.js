import cheerio from "cheerio";
/*import { selectByAttr } from "./utils.js";
import sendReq from "../src/dataGetter.js";
import fs from "fs";*/

function getName($){
  const data = $.html();
  const name = data.match(/"full_name":"([^"]+)"/);
  if (name && name[1]){
    return name[1];
  }
  return "N/A";
}

function getID($){
  const data = $.html();
  const id = data.match(/"fbid_v2":"(\d+)"/);
  if (id && id[1]){
    return id[1];
  }
  return "N/A";
}

function isPrivate($){
  const data = $.html();
  const isPrivate = data.match(/"is_private":([^,]+),/);
  if (isPrivate && isPrivate[1]){
    return isPrivate[1] === "true";
  }
  return "N/A";
}

function isVerified($){
  const data = $.html();
  const isVerified = data.match(/"is_verified":([^,]+),/);
  if (isVerified && isVerified[1]){
    return isVerified[1] === "true";
  }
  return "N/A";
}

function getFollowingCount($){
  /*
  const desc = selectByAttr($, "meta", {
    property: "og:description"
  }).attr("content")?.split(";")[0];
  const following = desc?.match(/([^\s]+) following/);
  if (following && following[1]){
    return following[1];
  }*/
  const data = $.html();
  const following = data.match(/"following_count":(\d+),/);
  if (following && following[1]){
    return parseInt(following[1]);
  }
  return "N/A";
}

function getFollowersCount($){
  /*
  const desc = selectByAttr($, "meta", {
    property: "og:description"
  }).attr("content")?.split(";")[0];
  const followers = desc?.match(/([^\s]+) followers/);
  if (followers && followers[1]){
    return followers[1];
  }*/
  const data = $.html();
  const followers = data.match(/"follower_count":(\d+),/);
  if (followers && followers[1]){
    return parseInt(followers[1]);
  }
  return "N/A";
} 

function getPostsCount($){
  /*
  const desc = selectByAttr($, "meta", {
    property: "og:description"
  }).attr("content")?.split(";")[0];
  const posts = desc?.match(/([^\s]+) posts/);
  if (posts && posts[1]){
    return posts[1];
  }*/
  const data = $.html();
  const posts = data.match(/"media_count":(\d+),/);
  if (posts && posts[1]){
    return parseInt(posts[1]);
  }
  return "N/A";
}

function getBio($){
  const data = $.html();
  const bio = data.match(/"biography":"([^"]+)"/);
  if (bio && bio[1]){
    return bio[1];
  }
  return "N/A";
}

function getCategory($){
  const data = $.html();
  const category = data.match(/"category":"([^"]+)"/);
  if (category && category[1]){
    return category[1];
  }
  return "N/A";
}

function getBioLinks($){
  try{
    const data = $.html();
    const bioLinks = data.match(/"bio_links":\[([^\]]*)\]/);
    const bioLinksObj = JSON.parse(`[${bioLinks[1]}]`).filter(a => a.url);
    let results = [];
    for (let i = 0; i < bioLinksObj.length; i++){
      const { url, title } = bioLinksObj[i];
      results.push({ url, title: title ? title : new URL(url).hostname })
    }
    return results;
  } catch(e){
    return "N/A";
  }
}

function main(data){
  try{
    const $ = cheerio.load(data);
    const name = JSON.parse(`"${getName($)}"`);
    const ID = getID($);
    const _private = isPrivate($);
    const verified = isVerified($);
    const following = getFollowingCount($);
    const followers = getFollowersCount($);
    const posts = getPostsCount($);
    const bio = JSON.parse(`"${getBio($)}"`);
    const bioLinks = getBioLinks($);
    const category = getCategory($);
    return {
      name,
      ID,
      private: _private,
      verified,
      following,
      followers,
      posts,
      bio,
      category,
      bioLinks
    }
  } catch(e){
    return "N/A";
  }
}

/*const { data } = await sendReq("https://instagram.com/kairudev");
console.log(main(data))
fs.writeFileSync("instagram.html", data);*/

export default main
