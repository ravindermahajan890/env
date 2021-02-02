var express = require("express");
var cookieParser = require("cookie-parser");
var app = express();
const axios = require("axios");

app.use(cookieParser());

app.get("/", function (req, res) {
  if (!req.session.user) {
    req.session.user = { name: "anonymous" };
  }
  res.end("Hello, Please user /get-env-details?env=[url]");
});

app.get("/get-env-details", async (req, res) => {
  const resp = await axios.get(req.query.env);
  res.send(resp.data.split("window.__SECRETS__ = ")[1].split("</script>")[0]);
});

app.listen(2000);
