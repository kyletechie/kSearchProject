import cheerio from "cheerio";
import fs from "fs";

//const data = fs.readFileSync("instagram.log", "utf-8");

function getName(data){
  const $ = cheerio.load(data);
  const name = $('meta[property="og:title"]').attr("content");
  console.log(name);
}

getName("wiw")
