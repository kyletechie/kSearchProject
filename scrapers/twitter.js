import sendRequest from "../src/dataGetter.js";

// XXX: CAN'T SCRAPE INFORMATION SINCE THE WEB IS JAVASCRIPT BASED RENDERED CONTENT
// XXX: ILL FINDBANOTHER WAY :D
const url = "https://x.com/elonmusk";

const { data } = await sendRequest(url);

console.log(data);

