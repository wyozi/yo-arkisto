var express = require('express');
var compression = require('compression');
var fs = require('fs');
var glob = require('glob');

var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(compression({filter: function() { return true; }}));
app.use(express.static(__dirname + '/public'));

app.get('/api/exams', function(request, response) {
  glob("public/kokeet/*/*.pdf", function(err, files) {
  	files = files.filter(function(e) {
  	  return e.split('/').pop().replace(".pdf", "").match(/^[sk]\d\d.?$/);
  	}).map(function(e) {
  	  return e.replace("public/kokeet/", "").replace(".pdf", "").replace("/", "-");
  	});
  	response.send(files);
  });
});

function servePdf(file, response) {
  fs.exists(file, function(exists) {
  	if (!exists) {
  	  response.sendStatus(404);
  	  return;
  	}
  	response.header("Content-Type", "application/pdf");
	fs.readFile(file, function(err, data) {
	  response.send(data);
	});
  });
}

app.get("/api/exams/:exam", function(request, response) {
  servePdf("public/kokeet/" + request.params.exam.replace("-", "/") + ".pdf", response);
});
app.get("/api/exams/:exam/:subtype", function(request, response) {
  servePdf("public/kokeet/" + request.params.exam.replace("-", "/") + request.params.subtype + ".pdf", response);
});

var wolframAPIKey = process.env.WOLFRAM_API;
if (!!wolframAPIKey) {
  var WolframClient = require('node-wolfram');
  var Wolfram = new WolframClient(wolframAPIKey);
  app.get("/api/wolfram", function(request, response) {
    var query = request.query.query;
    if (query == undefined) {
      response.sendStatus(400);
      return;
    }
    Wolfram.query(query, function(err, result) {
      if (err) {
        response.send({err: err});
        return;
      }
      if (result.queryresult.error) {
        response.send({err: result.queryresult.error});
        return;
      }

      var resultPod = result.queryresult.pod.filter(function(p) {
        return p.$.id == "Result";
      })[0];

      if (!resultPod) {
        response.send({err: "No results"});
        return;
      }
      response.send({plainResult: resultPod.subpod[0].plaintext[0]});
    });
  });
} else {
  app.get("/api/wolfram", function(request, response) {
    response.send({err: "Wolfram API not setup. Set WOLFRAM_API environment variable."})
  });
}

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});