import cheerio from "cheerio";

function getName($){
  const data = $.html();
  const name = data.match(/"nickname":"([^"]+)"/);
  if (name && name[1]){
    return name[1];
  }
  return "N/A";
}

function getID($){
  const data = $.html();
  const id = data.match(/"id":"([^"]\d+)"/);
  if (id && id[1]){
    return id[1];
  }
  return "N/A";
}

function getBio($){
  const data = $.html();
  const bio = data.match(/"signature":"([^"]+)"/);
  if (bio && bio[1]){
    return bio[1];
  }
  return "N/A";
}

function isVerified($){
  const data = $.html();
  const verified = data.match(/"verified":([^,]+),/);
  if (verified && verified[1]){
    return verified[1] === "true";
  }
  return "N/A";
}

function getCreationDate($){
  const data = $.html();
  const creationTime = data.match(/"createTime":([^,]\d+),/);
  if (creationTime && creationTime[1]){
    return new Date(parseInt(creationTime[1]) * 1000).toString();
  }
  return "N/A";
}

function isTiktokSeller($){
  const data = $.html();
  const ttSeller = data.match(/"ttSeller":([^,]+),/);
  if (ttSeller && ttSeller[1]){
    return ttSeller[1] === "true";
  }
  return "N/A";
}

function isPrivate($){
  const data = $.html();
  const _private = data.match(/"privateAccount":([^,]+),/);
  if (_private && _private[1]){
    return _private[1] === "true";
  }
  return "N/A";
}

function getCountry($){
  const data = $.html();
  const country = data.match(/"region":"([^"]+)"/);
  if (country && country[1]){
    return country[1];
  }
  return "N/A";
}

function getFollowerCount($){
  const data = $.html();
  const followers = data.match(/"followerCount":([^,]\d+),/);
  if (followers && followers[1]){
    return followers[1];
  }
  return "N/A";
}

function getFollowingCount($){
  const data = $.html();
  const following = data.match(/"followingCount":([^,]\d+),/);
  if (following && following[1]){
    return following[1];
  }
  return "N/A";
}

function getLikesCount($){
  const data = $.html();
  const likes = data.match(/"heartCount":([^,]\d+),/);
  if (likes && likes[1]){
    return likes[1];
  }
  return "N/A";
}

function getVideoCount($){
  const data = $.html();
  const videos = data.match(/"videoCount":"([^"]+)"/);
  if (videos && videos[1]){
    return videos[1];
  }
  return "N/A";
}

function main(data){
  const $ = cheerio.load(data);
  const name = getName($);
  const ID = getID($);
  const bio = getBio($);
  const verified = isVerified($);
  const _private = isPrivate($);
  const tiktokSeller = isTiktokSeller($);
  const accountCreationDate = getCreationDate($);
  const country = getCountry($);
  const followers = getFollowerCount($);
  const following = getFollowingCount($);
  const likes = getLikesCount($);
  const posts = getVideoCount($);
  return {
    name,
    private: _private,
    ID,
    bio,
    verified,
    tiktokSeller,
    accountCreationDate,
    country,
    followers,
    following,
    likes,
    posts
  }
}

export default main;
