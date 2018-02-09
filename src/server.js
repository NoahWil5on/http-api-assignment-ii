const http = require('http');
const url = require('url');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onPost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname !== '/addUser') return;

  const res = response;
  const body = [];

  request.on('error', (e) => {
    console.dir(e);
    res.statusCode = 400;
    res.end();
  });
  request.on('data', (data) => {
    body.push(data);
  });
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    jsonHandler.addUser(request, res, bodyParams);
  });
};

const onGet = (request, response, parsedUrl) => {
  switch (parsedUrl.pathname) {
    case '/style.css':
      htmlHandler.getStyle(request, response);
      break;
    case '/getUsers':
      jsonHandler.getUsers(request, response, 200);
      break;
    case '/':
    case '/client.html':
      htmlHandler.getIndex(request, response);
      break;
    default:
      jsonHandler.getUsers(request, response, 404);
      break;
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  switch (request.method) {
    case 'GET':
    case 'HEAD':
      onGet(request, response, parsedUrl);
      break;
    case 'POST':
      onPost(request, response, parsedUrl);
      break;
    default:
      break;
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
