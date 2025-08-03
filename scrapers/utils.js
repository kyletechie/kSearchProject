export function selectByAttr($, tag, tagId){
  let payload = tag;
  for (const [attrName, attrValue] of Object.entries(tagId)){
    payload += `[${attrName}=${attrValue}]`;
  }
  return $(payload);
}

export function unescapeHex(str) {
  return str.replace(/\\x([0-9A-Fa-f]{2})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
}

export function decodeUnicode(str) {
  return str.replace(/\\u([\dA-Fa-f]{4})/g, (_, code) =>
    String.fromCharCode(parseInt(code, 16))
  );
}

