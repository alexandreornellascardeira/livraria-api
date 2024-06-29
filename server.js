
import express from "express";
import cors from "cors";
import winston from "winston";
import { LoggingWinston } from "@google-cloud/logging-winston";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./doc.js";

import cookieParser from "cookie-parser";

import i18n from "i18n";

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Helper function to get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


import clienteRouter from "./routes/cliente.route.js"
import livroRouter from "./routes/livro.route.js"
import autorRouter from "./routes/autor.route.js"
import vendaRouter from "./routes/venda.route.js"

import ClienteService from "./services/cliente.service.js";


//Google Cloud Logging...
const loggingWinston = new LoggingWinston({
  projectId: process.env.GC_PROJECT_ID,
  logName: 'livraria-api-log',
});


const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: 'silly',//"info",//
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: "livraria-api.log" }),
    loggingWinston
  ],
  format: combine(
    label({ label: "livraria-api" }),
    timestamp(),
    myFormat
  )
});

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static("public"));
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(cookieParser());

// Configure i18n
i18n.configure({
  locales: ['pt', 'en'], // Add more locales as needed
  directory: join(__dirname, 'locales'),
  defaultLocale: 'pt',
  cookie: 'locale',
  queryParameter: 'lang'
});


// Initialize i18n
app.use(i18n.init);

// Middleware to set the locale based on cookie, query parameter, or Accept-Language header
app.use((req, res, next) => {
  let locale = req.cookies.locale || req.query.lang || req.acceptsLanguages(i18n.getLocales()) || 'pt';
  res.cookie('locale', locale, { maxAge: 900000, httpOnly: true }); // Set cookie with a max age and httpOnly flag
  i18n.setLocale(locale);
  next();
});


//Middleware for basic authentication
const authenticate = async (req, res, next) => {

  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).send(res.__('http_forbidden'));
  }

  const [type, credentials] = authHeader.split(' ');

  if (type !== 'Basic' || !credentials) {
    return res.status(401).send(res.__('http_forbidden'));
  }

  const [username, password] = Buffer.from(credentials, 'base64').toString().split(':');

  // Check if admin
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    req.user = { username, isAdmin: true };
    return next();
  }


  const user = new ClienteService().getClienteLogin(username, password);

  if (!user) {
    return res.status(401).send(res.__('http_forbidden'));
  }
  req.user = {
    username,
    isAdmin: false,
    nome: user.nome,
    cliente_id: user.cliente_id
  };

  next();

};


//Rotas...
app.use("/cliente", authenticate, clienteRouter);
app.use("/livro", authenticate, livroRouter);
app.use("/autor", authenticate, autorRouter);
app.use("/venda", authenticate, vendaRouter);


app.listen(8080, async () => {
  try {

    global.logger.info("Bookstore API Started!");
  } catch (err) {

    global.logger.error(err);

  }
});

export default app;