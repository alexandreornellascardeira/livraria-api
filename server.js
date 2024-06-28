
import express from "express";
import cors from "cors";
import winston from "winston";
import i18next from "i18next";
import Backend from "i18next-http-backend";
import { LoggingWinston } from "@google-cloud/logging-winston";
import swaggerUi from "swagger-ui-express";

/*TODO: ATUALIZAR A DOCUMENTAÇÃO DA API...*/
import { swaggerDocument } from "./doc.js";

/*Rotas*/
import clienteRouter from "./routes/cliente.route.js"
import livroRouter from "./routes/livro.route.js"
import autorRouter from "./routes/autor.route.js"
import vendaRouter from "./routes/venda.route.js"
 
/*Necessário para efetuar o login...*/
import ClienteService from "./services/cliente.service.js";


/*TODO: CONCLUIR IMPLEMENTAÇÃO DE INTERNACIONALIZAÇÃO...*/
i18next
  .use(Backend)
  .init({
    fallbackLng: 'pt', // Tradução default...
    lng: 'pt', // Configuração inicial...
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
  });

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
    /*TODO: DESATIVAR GERAÇÃO DE LOGS EM AQUIVO AO PUBLICAR NO GOOGLE CLOUD...*/
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

//Middleware for basic authentication
const authenticate = async (req, res, next) => {

  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).send('Unauthorized');
  }

  const [type, credentials] = authHeader.split(' ');

  if (type !== 'Basic' || !credentials) {
    return res.status(401).send('Unauthorized');
  }

  const [username, password] = Buffer.from(credentials, 'base64').toString().split(':');

  // Check if admin
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    req.user = { username, isAdmin: true };
    return next();
  }
 
  const user = new ClienteService().getClienteLogin(username, password);
  
  if (!user) {
    return res.status(401).send('Unauthorized');
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

app.use((req, res, next) => {
  const userLocale = req.headers['accept-language'] || 'pt';
  i18next.changeLanguage(userLocale);
  next();
});

app.listen(8080, async () => {
  try {

    global.logger.info("Bookstore API Started!");
  } catch (err) {

    global.logger.error(err);

  }
});

export default app;