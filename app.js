/*eslint no-undef: 0 */
const express = require('express');
const multer = require('multer'); // v1.0.5
const upload = multer({
  dest: 'uploads/' // this saves your file into a directory called "uploads"
}); 

// const url = require('url')
const port = process.env.PORT || 8000;
const routes = require('./app/routes');

const log = require('pino')();
log.level = process.env.LOG_LEVEL || 'info';


const app = express();
// app.use(bodyParser.json()) // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// health endpoint
app.all('/health', (req, res) => {
  return routes.health(req, res);
});

// app.route('/headers')
//   .get(
app.all('/', (req, res) => {
  return routes.root(req, res);
});

// pause endpoint
app.all('/pause', (req, res) => {
  routes.pause(req, res);
});

// pause endpoint
app.all('/headers', (req, res) => {
  routes.header(req, res);
});

// upload endpoint
app.all('/upload', upload.single('file'), (req, res) => {
  routes.upload(req, res);
});

// debug endpoint
app.all('/debug', (req, res) => {
  routes.debug(req, res);
});


app.listen(port, () => console.log(`Parrot server is listening on ${port}!`));
