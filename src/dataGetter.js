import axios from "axios";

const defaultHeader = {
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7", 
  "Accept-Encoding": "gzip, deflate, br", 
  "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8,fil;q=0.7", 
  "Priority": "u=0, i", 
  "Sec-Ch-Ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"", 
  "Sec-Ch-Ua-Mobile": "?1", 
  "Sec-Ch-Ua-Platform": "\"Android\"", 
  "Sec-Fetch-Dest": "document", 
  "Sec-Fetch-Mode": "navigate", 
  "Sec-Fetch-Site": "none", 
  "Sec-Fetch-User": "?1", 
  "Upgrade-Insecure-Requests": "1", 
  "User-Agent": "Mozilla/5.0 (Linux; Android 14; CPH2583) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.112 Mobile Safari/537.36 Instagram 317.3.0.25.118", 
}

export default async (url, cheader, opts) => {
  try{
    defaultHeader["Host"] = new URL(url).host;
    if (cheader?.header && !cheader?.overwrite){
      defaultHeader = { ...defaultHeader, ...cheader.header };
    }
    return await axios.get(url, { 
      headers: cheader?.overwrite && cheader?.header 
        ? cheader.header 
        : defaultHeader,
      ...opts 
    });
  } catch(e){
    return {
      emsg: e.message,
      status: e?.response ? e.response.statusText : e.code
    };
  }
}
