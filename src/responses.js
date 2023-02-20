const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const users = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respond = (request, response, content, type, code) => {
  // set status code (200 success) and content type
  response.writeHead(code, { 'Content-Type': type });
  // write the content string or buffer to response
  response.write(content);
  // send the response to the client
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  // object for our headers
  // Content-Type for json
  const headers = {
    'Content-Type': 'application/json',
  };
    // send response without json object, just headers
  response.writeHead(status, headers);

  response.end();
};

const getCSS = (request, response) => respond(request, response, css, 'text/css', 200);

const getIndex = (request, response) => respond(request, response, index, 'text/html', 200);

const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  respondJSON(request, response, 200, responseJSON);
};

const headUsers = (request, response) => respondJSONMeta(request, response, 200);

const getNotReal = (request, response) => {
  const responseJson = {
    message: 'The page you are looking for was not found',
  };
  return respond(request, response, JSON.stringify(responseJson), 'application/json', 404);
};

const headNotReal = (request, response) => respondJSONMeta(request, response, 404);

const addUser = (request, response, name, age) => {
  if (!name || !age) {
    const responseJson = {
      message: 'Name and age are both required',
    };
    return respond(request, response, JSON.stringify(responseJson), 'application/json', 400);
  }

  // change to make to user
  // This is just a dummy object for example
  const newUser = {
    age,
    name,
  };

  // modifying our dummy object
  // just indexing by time for now

  if (users[newUser.name] != null) {
    // If someone with the name already exists, overwrite it and respond 204
    users[newUser.name] = newUser;

    return respondJSONMeta(request, response, 204);
  }
  // If they don't, it'll create one so respond 201

  users[newUser.name] = newUser;
  const responseJson = {
    Message: 'Created Successfully',
  };
  // return a 201 created status
  return respondJSON(request, response, 201, responseJson);
};

const notFound = (request, response) => {
  const responseJson = {
    message: 'The page you are looking for was not found',
  };
  return respond(request, response, JSON.stringify(responseJson), 'application/json', 404);
};

module.exports = {
  getCSS,
  getIndex,
  getNotReal,
  headNotReal,
  headUsers,
  addUser,
  getUsers,
  notFound,
};
