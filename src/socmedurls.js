import ytscraper from "../scrapers/youtube.js";
import igscraper from "../scrapers/instagram.js";

class SocuriFormatter {
  constructor(username) {
    this.username = username;
  }

  #commonURIUnPlacement(url, atSymBeforeUn) {
    return `${url}/${atSymBeforeUn ? "@" : ""}${this.username}`;
  }

  soc = {
    facebook: () => ({
      url: this.#commonURIUnPlacement("https://facebook.com"),
      platform: "Facebook"
    }),
    instagram: () => ({
      url: this.#commonURIUnPlacement("https://instagram.com"),
      platform: "Instagram",
      scraper: igscraper
    }),
    twitter: () => ({
      url: this.#commonURIUnPlacement("https://x.com"),
      platform: "Twitter/X"
    }),
    tiktok: () => ({
      url: this.#commonURIUnPlacement("https://tiktok.com", true),
      platform: "Tiktok"
    }),
    linkedin: () => ({
      url: this.#commonURIUnPlacement("https://linkedin.com/in"),
      platform: "LinkedIn"
    }),
    github: () => ({
      url: this.#commonURIUnPlacement("https://github.com"),
      platform: "Github"
    }),
    reddit: () => ({
      url: this.#commonURIUnPlacement("https://reddit.com/user"),
      platform: "Reddit"
    }),
    youtube: () => ({
      url: this.#commonURIUnPlacement("https://youtube.com", true),
      platform: "Youtube",
      scraper: ytscraper
    }),
    pinterest: () => ({
      url: this.#commonURIUnPlacement("https://pinterest.com"),
      platform: "Pinterest"
    }),
    snapchat: () => ({
      url: this.#commonURIUnPlacement("https://snapchat.com/add"),
      platform: "Snapchat"
    }),
    threads: () => ({
      url: this.#commonURIUnPlacement("https://threads.com", true),
      platform: "Threads"
    }),
    tumblr: () => ({
      url: `https://${this.username}.tumblr.com`,
      platform: "Tumblr"
    }),
    medium: () => ({
      url: this.#commonURIUnPlacement("https://medium.com", true),
      platform: "Medium"
    }),
    devto: () => ({
      url: this.#commonURIUnPlacement("https://dev.to"),
      platform: "Dev.to"
    }),
    steam: () => ({
      url: this.#commonURIUnPlacement("https://steamcommunity.com/id"),
      platform: "Steam"
    }),
    behance: () => ({
      url: this.#commonURIUnPlacement("https://behance.net"),
      platform: "Behance"
    }),
    dribbble: () => ({
      url: this.#commonURIUnPlacement("https://dribbble.com"),
      platform: "Dribbble"
    }),
    koo: () => ({
      url: this.#commonURIUnPlacement("https://kooapp.com/profile"),
      platform: "Koo"
    }),
    soundcloud: () => ({
      url: this.#commonURIUnPlacement("https://soundcloud.com"),
      platform: "SoundCloud"
    }),
    replit: () => ({
      url: this.#commonURIUnPlacement("https://replit.com", true),
      platform: "Replit"
    }),
    figma: () => ({
      url: this.#commonURIUnPlacement("https://figma.com", true),
      platform: "Figma"
    }),
    codepen: () => ({
      url: this.#commonURIUnPlacement("https://codepen.io"),
      platform: "CodePen"
    }),
    producthunt: () => ({
      url: this.#commonURIUnPlacement("https://producthunt.com", true),
      platform: "Product Hunt"
    }),
    loam: () => ({
      url: this.#commonURIUnPlacement("https://loam.com/u"),
      platform: "Loam"
    }),
    gitlab: () => ({
      url: this.#commonURIUnPlacement("https://gitlab.com"),
      platform: "GitLab"
    }),
    bitbucket: () => ({
      url: this.#commonURIUnPlacement("https://bitbucket.org"),
      platform: "BitBucket"
    }),
    glitch: () => ({
      url: this.#commonURIUnPlacement("https://glitch.com", true),
      platform: "Glitch"
    }),
    blogger: () => ({
      url: `https://${this.username}.blogspot.com`,
      platform: "Blogger"
    }),
    vk: () => ({
      url: this.#commonURIUnPlacement("https://vk.com"),
      platform: "VK"
    }),
    twitch: () => ({
      url: this.#commonURIUnPlacement("https://twitch.tv"),
      platform: "Twitch"
    }),
    kick: () => ({
      url: this.#commonURIUnPlacement("https://kick.com"),
      platform: "Kick"
    }),
    rumble: () => ({
      url: this.#commonURIUnPlacement("https://rumble.com/user"),
      platform: "Rumble"
    }),
    buymeacoffee: () => ({
      url: this.#commonURIUnPlacement("https://buymeacoffee.com"),
      platform: "Buy Me a Coffee"
    }),
    patreon: () => ({
      url: this.#commonURIUnPlacement("https://patreon.com"),
      platform: "Patreon"
    }),
    kofi: () => ({
      url: this.#commonURIUnPlacement("https://ko-fi.com"),
      platform: "Ko-fi"
    }),
    wattpad: () => ({
      url: this.#commonURIUnPlacement("https://wattpad.com/user"),
      platform: "Wattpad"
    }),
    imgur: () => ({
      url: this.#commonURIUnPlacement("https://imgur.com/user"),
      platform: "Imgur"
    }),
    kaggle: () => ({
      url: this.#commonURIUnPlacement("https://kaggle.com"),
      platform: "Kaggle"
    }),
    lichess: () => ({
      url: this.#commonURIUnPlacement("https://lichess.org/@"),
      platform: "Lichess"
    }),
    minecraft: () => ({
      url: this.#commonURIUnPlacement("https://namemc.com/profile"),
      platform: "Minecraft"
    }),
    npm: () => ({
      url: `https://npmjs.com/~${this.username}`,
      platform: "Node Package Manager (NPM)"
    }),
    roblox: () => ({
      url: `https://www.roblox.com/users/profile?username=${this.username}`,
      platform: "Roblox"
    }),
    unsplash: () => ({
      url: this.#commonURIUnPlacement("https://unsplash.com", true),
      platform: "Unsplash"
    }),
    chess: () => ({
      url: this.#commonURIUnPlacement("https://chess.com/member"),
      platform: "Chess.com"
    }),
    hackerrank: () => ({
      url: this.#commonURIUnPlacement("https://hackerrank.com"),
      platform: "HackerRank"
    }),
    tinder: () => ({
      url: this.#commonURIUnPlacement("https://tinder.com", true),
      platform: "Tinder"
    }),
    telegram: () => ({
      url: this.#commonURIUnPlacement("https://t.me"),
      platform: "Telegram"
    })
  };

  getAll() {
    return Object.entries(this.soc).map(([_, fn]) => fn());
  }
}

export default SocuriFormatter;
