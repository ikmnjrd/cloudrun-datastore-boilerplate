import { app, port } from './server';

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});