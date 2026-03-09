const crypto = require("crypto");

function generateSignature(data, passphrase = null) {
  let pfOutput = "";

  for (let key in data) {
    if (data[key] !== "") {
      pfOutput += key + "=" + encodeURIComponent(data[key]).replace(/%20/g, "+") + "&";
    }
  }

  // remove last &
  pfOutput = pfOutput.slice(0, -1);

  if (passphrase) {
    pfOutput += "&passphrase=" + encodeURIComponent(passphrase).replace(/%20/g, "+");
  }

  return crypto.createHash("md5").update(pfOutput).digest("hex");
}

module.exports = { generateSignature };
