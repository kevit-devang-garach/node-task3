import Config from '../environments/index';

export const dbConnection = {
  url: Config.MONGODB_URL,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
