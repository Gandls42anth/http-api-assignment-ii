const http = require('http'); //http module
const url = require('url'); //url module
const responseHandler = require('./responses.js'); 
const port = process.env.PORT || process.env.NODE_PORT || 3000;
const query = require('querystring');

const urlStruct = {
  'GET':{
    '/': responseHandler.getIndex,
    '/style.css': responseHandler.getCSS,
    '/getUsers': responseHandler.getUsers,
    '/notReal': responseHandler.getNotReal,
    notFound: responseHandler.notFound,
  },
  'HEAD':{
    '/getUsers': responseHandler.headUsers,
    '/notReal': responseHandler.headNotReal,
    notFound: responseHandler.notFound,

  },
  'POST':{
    '/addUser': responseHandler.addUser,
    notFound: responseHandler.notFound,
  },
};


const onRequest = (request,response) => {
    const parsedUrl = url.parse(request.url);
    const test = request.method;
    debugger;
    if(!urlStruct[request.method]) {
        return urlStruct['HEAD'].notFound(request,response);
    }
    //If it's a head/get request don't bother with parameters just call the method
    if(request.method === 'POST'){


        const body = [];
        request.on('error', (err) => {
            console.dir(err);
            response.statusCode = 400;
            response.end();
          });
        
        request.on('data', (chunk) => {
            body.push(chunk);
          });

        request.on('end', () => {
            const bodyString = Buffer.concat(body).toString();
            const bodyParams = query.parse(bodyString);
        debugger;
            //Once we have the bodyParams object, we will call the handler function. We then
            //proceed much like we would with a GET request.
            urlStruct[request.method][parsedUrl.pathname](request, response, bodyParams.name,bodyParams.age);
        });
    }else{
        if(urlStruct[request.method][parsedUrl.pathname]){
            urlStruct[request.method][parsedUrl.pathname](request,response);
        }else{
            urlStruct['GET']['/'](request, response);
        }
    };
}

//start server
http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
  });