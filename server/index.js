const { app, api, port } = require('./server');

api.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});