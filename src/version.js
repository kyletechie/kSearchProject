import _package from "../package.json" with { type: "json" };

function getVersion(){
  return /^\d+.\d+.\d+$/.test(_package.version) ? `v${_package.version}` : "v?.?.?";
}

export default getVersion;
