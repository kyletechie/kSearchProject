import colors from "./colors.js";

function dataFormat(info){
  for (const [key, value] of Object.entries(info)){
    console.log(`${colors.yellow}  • ${key}: ${colors.green}${value}`)
  }
}
