import { inspect } from "util";
import SocMeds from "./src/socmedurls.js";
import sendRequest from "./src/dataGetter.js";

const username = new SocMeds("kairudev");

const allSocMeds = Object.values(username.getAll());

const results = await Promise.all(
  allSocMeds.map(sm => 
    sendRequest(sm.url).then(data => ({
      ...sm,
      response: data
    }))
  )
);

for (const result of results.filter(a => a.response.status === 200)){
  console.log(`${result.url} (${result.response.status} ${result.response.statusText})`);
}


