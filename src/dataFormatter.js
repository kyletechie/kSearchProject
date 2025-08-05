import colors from "./colors.js";

export default function dataFormat(info, indent = 1, platform) {
  if (indent === 1) {
    console.log(`${colors.yellow}(${platform} Scan Report)${colors.reset}`);
  }

  for (const [key, value] of Object.entries(info)) {
    if (Array.isArray(value)) {
      console.log(`${"  ".repeat(indent)}${colors.green}${capitalize(key)}:${colors.reset}`);
      value.forEach((item, index) => {
        console.log(`${"  ".repeat(indent)}  ${colors.yellow}(${index + 1})`);
        if (typeof item === "object" && item !== null) {
          dataFormat(item, indent + 2);
        } else {
          console.log(`${"  ".repeat(indent + 2)}${colors.yellow}${item}${colors.reset}`);
        }
      });
    } else if (typeof value === "object" && value !== null) {
      console.log(`${"  ".repeat(indent)}${colors.green}${capitalize(key)}:${colors.reset}`);
      dataFormat(value, indent + 1);
    } else {
      let displayValue = value;
      if (typeof value === "boolean") {
        displayValue = value ? "Yes" : "No";
      }
      console.log(`${"  ".repeat(indent)}${colors.green}${capitalize(key)}:${colors.reset} ${colors.yellow}${displayValue}${colors.reset}`);
    }
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


/*dataFormat({
  name: "Kyle Tilano 󱢏",
  private: false,
  verified: false,
  following: 83,
  followers: 35,
  posts: 11,
  bio: "big dih 1000 inch",
  bioLinks: [
    { url: "https://kairudev.vercel.app", title: "kairudev.vercel.app" },
    { url: "https://kyledev-psi.vercel.app", title: "Another Web" },
  ],
});*/

