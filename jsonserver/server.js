const jsonServer = require('json-server');
const bodyParser = require('body-parser');
const cors = require('cors'); // Импорт cors
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(bodyParser.json());
server.use(cors()); // 

// Обработка POST-запроса на /login
server.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = router.db.get('users').find({ username, password }).value();

  if (user) {
    const { accessToken, expire, username } = user;
    res.json({ accessToken, expire, username });
  } else {
    res.status(401).json({ message: 'Неверный логин или пароль' });
  }
});

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running on http://localhost:3000');
});