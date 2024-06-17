const jsonServer = require('json-server');
const bodyParser = require('body-parser');
const cors = require('cors'); // Импорт cors
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(bodyParser.json());
server.use(cors()); // 

const timeout = 1000 // для задержки (тесты)

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

server.post('/objectsearch', (req, res) => {
  const { inn, tone, documentCount, startDate, endDate, maxCompleteness, businessContext, mainRole, riskFactors, technicalNews, announcements, newsSummary } = req.body;

  const mockResponse = ''

  setTimeout(() => {
    res.json(mockResponse);
  }, timeout); 
});

server.post('/objectsearch/histograms', (req, res) => {
  const { inn, tone, documentCount, startDate, endDate, maxCompleteness, businessContext, mainRole, riskFactors, technicalNews, announcements, newsSummary } = req.body;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const filteredDates = router.db.get('dates').filter(item => {
    const date = new Date(item.date.split('.').reverse().join('-'));
    return date > start && date < end;
  });
  const allCount = filteredDates.reduce((sum, item) => sum + item.count, 0);
  const response = {
    allcount: allCount,
    dates: filteredDates
  };
  setTimeout(() => {
    res.json(response);
  }, timeout); 
});

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running on http://localhost:3000');
});