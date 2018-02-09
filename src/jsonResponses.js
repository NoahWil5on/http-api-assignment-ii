const users = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  switch (status) {
    case 404:
      response.write(JSON.stringify({ message: 'The page you are looking for was not found.' }));
      break;
    case 204:
      break;
    default:
      response.write(JSON.stringify(object));
      break;
  }
  response.end();
};

const getUsers = (request, response, status) => {
  const responseJSON = { users };
  respondJSON(request, response, status, responseJSON);
};

const addUser = (request, response, body) => {
  const responseJSON = { message: 'Name and age are both required.' };

  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
  let status = 201;
  if (users[body.name]) status = 204;
  else users[body.name] = {};

  users[body.name].name = body.name;
  users[body.name].age = body.age;

  if (status === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, status, responseJSON);
  }
  return respondJSON(request, response, status, {});
};

module.exports = {
  getUsers,
  addUser,
};
