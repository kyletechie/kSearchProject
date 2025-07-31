export function selectByAttr($, tag, tagId){
  let payload = tag;
  for (const [attrName, attrValue] of Object.entries(tagId)){
    payload += `[${attrName}=${attrValue}]`;
  }
  return $(payload);
}
