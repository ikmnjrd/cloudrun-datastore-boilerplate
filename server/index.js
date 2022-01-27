const { app, port } = require('./server');

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});