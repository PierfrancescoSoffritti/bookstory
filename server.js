const express = require("express");
const app = express();
const http = require("follow-redirects").https;

function checkHttps(req, res, next){
  // protocol check, if http, redirect to https
  if(req.get('X-Forwarded-Proto').indexOf("https")!=-1){
    return next()
  } else {
    res.redirect('https://' + req.hostname + req.url);
  }
}

app.all('*', checkHttps)
app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/yearinbooks", (request, response) => {
  response.sendFile(__dirname + "/views/year-in-books.html");
});

app.get("/toppicks", (request, response) => {
  response.sendFile(__dirname + "/views/top-picks.html");
});

app.get("/logs", (request, response) => {
  const query = replaceAll(request.query.q, " ", "+");
  console.log("query", query);

  http
    .get(`https://www.goodreads.com/book/title?id=${query}`, httpResponse => {
      console.log(httpResponse.responseUrl);

      let str = "";

      httpResponse.on("data", chunk => {
        str += chunk;
      });

      httpResponse.on("end", () => {
        console.log("end");

        const result = { coverUrl: "", author: "", title: "" };

        // cover
        const imgTagMatch = str.match(/(img id="coverImage" alt=".*" src=".*")/g);
        if (imgTagMatch == null) {
          console.error("img tag not found");
        } else {
          const imgTag = imgTagMatch[0];
          const url = imgTag
            .match(/(src=".*")/g)[0]
            .replace('src="', "")
            .replace('"', "");
          result.coverUrl = url;
        }

        // author
        const authorTagMatch = str.match(/(<a class="authorName".*><span itemprop="name">.*<\/span><\/a>)/g);
        if (authorTagMatch == null) {
          console.error("author tag not found");
        } else {
          const authorTag = authorTagMatch[0];
          const author = authorTag
            .match(/(<span itemprop="name">.*<\/span>)/g)[0]
            .replace('<span itemprop="name">', "")
            .replace("</span>", "");
          result.author = author;
        }

        // title
        const titleTagMatch = str.match(/(<h1 id="bookTitle".*itemprop="name">\n.*\n<\/h1>)/g);
        if (titleTagMatch == null) {
          console.error("title tag not found");
        } else {
          const titleTag = titleTagMatch[0];
          const title = titleTag
            .match(/(>\n.*\n<\/h1>)/g)[0]
            .replace(">\n", "")
            .replace("\n</h1>", "");
          result.title = title.trim();
        }

        response.json(result);
      });
    })
    .on("error", err => {
      console.error(err);
    });
});

function replaceAll(string, replace, replacement) {
  while (string.includes(replace)) {
    string = string.replace(replace, replacement);
  }
  return string;
}

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
