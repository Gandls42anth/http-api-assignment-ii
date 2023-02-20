const { debug } = require('console');
const http = require('http'); // http module
const url = require('url'); // url module
const responseHandler = require('./response.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// here we create a object to route our requests to the proper
// handlers. the top level object is indexed by the request
// method (get, head, etc). We can use request.method to return
// the routing object for each type of method. Once we say
// urlStruct[request.method], we recieve another object which
// routes each individual url to a handler. We can index this
// object in the same way we have used urlStruct before.
const urlStruct = {

  '/': responseHandler.getIndex,
  '/style.css': responseHandler.getCSS,
  '/success': responseHandler.success,
  '/badRequest': responseHandler.badRequest,
  '/unauthorized': responseHandler.unauthorized,
  '/forbidden': responseHandler.forbidden,
  '/internal': responseHandler.internal,
  '/notImplemented': responseHandler.notImplemented,
  '/notFound': responseHandler.notFound,
  notFound: responseHandler.notFound,

};

// function to handle requests
const onRequest = (request, response) => {
  // first we have to parse information from the url
  const parsedUrl = url.parse(request.url);

  const acceptedTypes = request.headers.accept.split(',');
  // If accepted types does not exist, that means go to default
  // If it does exist, use the first entry
  if (acceptedTypes[0] != 'application/json' && acceptedTypes[0] != 'text/xml') {
    acceptedTypes[0] = 'application/json';
  }
  const pref = acceptedTypes[0];

  // check if the path name (the /name part of the url) matches
  // any in our url object. If so call that function. If not, default to index.
  if (parsedUrl.pathname == '/badRequest') {
    if (parsedUrl.query == 'valid=true') {
      urlStruct[parsedUrl.pathname](request, response, pref, true);
    } else {
      urlStruct[parsedUrl.pathname](request, response, pref, false);
    }
  } else if (parsedUrl.pathname == '/unauthorized') {
    if (parsedUrl.query == 'loggedIn=yes') {
      urlStruct[parsedUrl.pathname](request, response, pref, true);
    } else {
      urlStruct[parsedUrl.pathname](request, response, pref, false);
    }
  } else if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, pref, true);
  } else {
    // otherwise send them to the index (normally this would be the 404 page)
    urlStruct['/'](request, response, pref, true);
  }
};

// start server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
