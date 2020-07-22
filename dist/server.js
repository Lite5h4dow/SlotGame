"use strict";
var express = require("express");
var serveStatic = require("serve-static");
var app = express();
app.use(serveStatic(__dirname + "/static"));
var port = process.env.PORT || 8000;
app.listen(port, function () {
    console.log("running");
});
//# sourceMappingURL=server.js.map