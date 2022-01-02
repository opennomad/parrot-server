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

// the root endpoint
app.all('/', routes.root);

// health endpoint
app.all('/health', routes.health);

// pause endpoint
app.all('/pause', routes.pause);

// headers endpoint
app.all('/headers', routes.headers);
//
// echo endpoint
app.all('/echo', routes.echo);

// upload endpoint
app.all('/upload', upload.single('file'), (req, res) => {
  routes.upload(req, res);
});


app.listen(port, () => console.log(`Parrot server is listening on ${port}!`));
