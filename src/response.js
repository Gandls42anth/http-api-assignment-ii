const fs = require('fs'); // pull in the file system module
const { get } = require('http');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const respond = (request, response, content, type, code) => {
  // set status code (200 success) and content type
  response.writeHead(code, { 'Content-Type': type });
  // write the content string or buffer to response
  response.write(content);
  // send the response to the client
  response.end();
};

const getCSS = (request, response, acceptedType, bool) => {
  respond(request, response, css, 'text/css', 200);
};

const getIndex = (request, response, acceptedType, bool) => {
  respond(request, response, index, 'text/html', 200);
};

const success = (request, response, acceptedType, bool) => {
  if (acceptedType === 'application/json') {
    const responseJson = {
      message: 'this is a successful response',
    };
    respond(request, response, JSON.stringify(responseJson), acceptedType, 200);
  } else if (acceptedType === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>this is a successful response</message>`;
    responseXML = `${responseXML} </response>`;
    respond(request, response, responseXML, acceptedType, 200);
  }
};

const unauthorized = (request, response, acceptedType, loggedin) => {
  if (acceptedType === 'application/json') {
    if (loggedin) {
      const responseJson = {
        message: 'this is a successful unauthorized response',
      };
      respond(request, response, JSON.stringify(responseJson), acceptedType, 200);
    } else {
      const responseJson = {
        message: 'missing loggedIn query parameter set to yes',
      };
      respond(request, response, JSON.stringify(responseJson), acceptedType, 401);
    }
  } else if (acceptedType === 'text/xml') {
    if (loggedin) {
      let responseXML = '<response>';
      responseXML = `${responseXML} <message>this is a successful unauthorized response</message>`;
      responseXML = `${responseXML} </response>`;
      respond(request, response, responseXML, acceptedType, 200);
    } else {
      let responseXML = '<response>';
      responseXML = `${responseXML} <message>missing loggedIn query parameter set to yes</message>`;
      responseXML = `${responseXML} </response>`;
      respond(request, response, responseXML, acceptedType, 401);
    }
  }
};

const badRequest = (request, response, acceptedType, valid) => {
  if (acceptedType === 'application/json') {
    if (valid) {
      const responseJson = {
        message: 'this is a successful bad request response',
      };
      respond(request, response, JSON.stringify(responseJson), acceptedType, 200);
    } else {
      const responseJson = {
        message: 'missing valid query parameter set to true',
      };
      respond(request, response, JSON.stringify(responseJson), acceptedType, 400);
    }
  } else if (acceptedType === 'text/xml') {
    if (valid) {
      let responseXML = '<response>';
      responseXML = `${responseXML} <message>this is a successful bad request response</message>`;
      responseXML = `${responseXML} </response>`;
      respond(request, response, responseXML, acceptedType, 200);
    } else {
      let responseXML = '<response>';
      responseXML = `${responseXML} <message>missing valid query parameter</message>`;
      responseXML = `${responseXML} </response>`;
      respond(request, response, responseXML, acceptedType, 400);
    }
  }
};

const notImplemented = (request, response, acceptedType, bool) => {
  if (acceptedType === 'application/json') {
    const responseJson = {
      message: 'A get request for this page has not been implemented yet. Check again later for updated content',
    };
    respond(request, response, JSON.stringify(responseJson), acceptedType, 501);
  } else if (acceptedType === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>A get request for this page has not been implemented yet. Check again later for updated content</message>`;
    responseXML = `${responseXML} </response>`;
    respond(request, response, responseXML, acceptedType, 501);
  }
};

const forbidden = (request, response, acceptedType, bool) => {
  if (acceptedType === 'application/json') {
    const responseJson = {
      message: 'you do not have access to this contnet',
    };
    respond(request, response, JSON.stringify(responseJson), acceptedType, 403);
  } else if (acceptedType === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>you do not have access to this content</message>`;
    responseXML = `${responseXML} </response>`;
    respond(request, response, responseXML, acceptedType, 403);
  }
};

const internal = (request, response, acceptedType, bool) => {
  if (acceptedType === 'application/json') {
    const responseJson = {
      message: 'Internal Server Error, Something went wrong',
    };
    respond(request, response, JSON.stringify(responseJson), acceptedType, 500);
  } else if (acceptedType === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>Internal Server Error, Something went wrong</message>`;
    responseXML = `${responseXML} </response>`;
    respond(request, response, responseXML, acceptedType, 500);
  }
};

const notFound = (request, response, acceptedType, bool) => {
  if (acceptedType === 'application/json') {
    const responseJson = {
      message: 'The page you are looking for was not found',
    };
    respond(request, response, JSON.stringify(responseJson), acceptedType, 404);
  } else if (acceptedType === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>The page you are looking for was not found</message>`;
    responseXML = `${responseXML} </response>`;
    respond(request, response, responseXML, acceptedType, 404);
  }
};

module.exports = {
  getCSS,
  getIndex,
  forbidden,
  notImplemented,
  notFound,
  internal,
  badRequest,
  unauthorized,
  success,
};
