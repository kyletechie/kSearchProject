import { Parser } from "@json2csv/plainjs";
import json2txt from "json-to-txt";
import yaml from "js-yaml";
import jsonfile from "jsonfile";
import fs from "fs";
import path from "path";

function dump2file(outputPath, results){
  let data = "";
  if (path.extname(outputPath) === ".csv"){
    const parser = new Parser();
    data = parser.parse(results);
  }
  else if (path.extname(outputPath) === ".yaml"){
    data = yaml.dump(results);
  }
  else if (path.extname(outputPath) === ".txt"){
    data = json2txt({ data: results });
  }
  else{
    jsonfile.writeFileSync(outputPath, results, { spaces: 2 });
    return;
  }
  fs.writeFileSync(outputPath, data, "utf8");
}

export default dump2file;
