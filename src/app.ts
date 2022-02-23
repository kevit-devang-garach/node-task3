import express from 'express';
// import path from 'path';
import mongoose from 'mongoose';
import helmet from 'helmet';
import hpp from 'hpp';
import { customLogger, pinoFormatConfig } from './services/logger';
import Config from './environments/index';
import { dbConnection } from './databases/mongoDbConnection';
import { errorMiddleware } from './middleware/error.middleware';
// dotenv.config({ path: path.join(__dirname, '../.env') });

// const demo: {
//     "name": string,
//     "contact": number,
// } = {
//     "name": "devang",
//     "contact":1
// } as const

declare global {
  namespace Express {
    export interface Request {
      user: any;
      token: any;
    }
    export interface Response {
      user: any;
      token: any;
    }
  }
}

class App {
  public app: express.Application;

  public port: number;

  env: string;

  logger: any;

  constructor(routes: any) {
    this.app = express();
    this.port = Config.APP_PORT;
    this.env = Config.NODE_ENV;
    this.logger = pinoFormatConfig[this.env];
    this.databaseConnection();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      this.logger.info(`================================`);
      this.logger.info(`====== Server is live 🚀  ======`);
      this.logger.info(`=======    listening     =======`);
      this.logger.info(`========   PORT ${this.port}    ========`);
      this.logger.info(`================================`);
    });
  }

  private databaseConnection() {
    mongoose.connection.on('connected', () => {
      this.logger.info(`=== 🔥 DATABASE - Connected  ===`);
      this.logger.info(`================================`);
    });
    mongoose.connection.on('error', err => {
      this.logger.error(`DATABASE - ERROR: ${err}`);
    });
    mongoose.connect(dbConnection.url);
  }

  private initializeRoutes(routes: object[]) {
    // console.log(demo.name, typeof(demo.name) ,typeof(demo))
    routes.forEach((route: any) => {
      // console.log(typeof route, route)
      this.app.use('/', route.router);
    });
  }

  private initializeMiddlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(hpp());
    this.app.use(customLogger[this.env]);
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}
export default App;
