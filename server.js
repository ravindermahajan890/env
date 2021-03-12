var express = require("express");
var cookieParser = require("cookie-parser");
var app = express();
const axios = require("axios");
const { jsonToTableHtmlString } = require("json-table-converter");

app.use(cookieParser());

const flattenObject = (ob) => {
  var toReturn = {};

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == "object") {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + "." + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};

app.get("/", function (req, res) {
  if (!req.session.user) {
    req.session.user = { name: "anonymous" };
  }
  res.end("Hello, Please user /get-env-details?env=[url]");
});

app.get("/get-env-details-hell", async (req, res) => {
  const resp = await axios.get(req.query.env);
  var json = resp.data.split("window.__SECRETS__ = ")[1].split("</script>")[0];
  const html = jsonToTableHtmlString(JSON.parse(json));
  res.send(html);
});

app.get("/get-cms-config-hell", async (req, res) => {
  const resp = await axios.get(req.query.env);
  const { CMS_BASE_URL, CONFIGURATION_API_KEY } = JSON.parse(resp.data.split("window.__SECRETS__ = ")[1].split("</script>")[0]);
  const respCMS = await axios.get(
    CMS_BASE_URL + CONFIGURATION_API_KEY + "/latest/config.json"
  );
  const flattenedData = flattenObject(respCMS.data);
  const html = jsonToTableHtmlString(flattenedData);
  res.send(html);
});

app.listen(2000);
