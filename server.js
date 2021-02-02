var express = require("express");
var cookieParser = require("cookie-parser");
var app = express();
const axios = require("axios");
const { jsonToTableHtmlString } = require("json-table-converter");

app.use(cookieParser());

app.get("/", function (req, res) {
  if (!req.session.user) {
    req.session.user = { name: "anonymous" };
  }
  res.end("Hello, Please user /get-env-details?env=[url]");
});

app.get("/get-env-details", async (req, res) => {
  const resp = await axios.get(req.query.env);
  var json = resp.data.split("window.__SECRETS__ = ")[1].split("</script>")[0];
  const html = jsonToTableHtmlString(JSON.parse(json));
  res.send(html);
});

app.listen(2000);
