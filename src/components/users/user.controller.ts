import { Response, Request, NextFunction } from 'express';
import HttpException from '../../utils/error.utils';
import { createNewMember } from './user.DAL';
import { USER_ERROR_CODES } from './user.error';
import axios from 'axios';
import User from './user.model';

class UserController {
  async signUpUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, department, password, isActive, isAdmin } = req.body;
      if (req && req.user && (!req.user.isActive || !req.user.isAdmin)) {
        throw Error('USER IS NOT AUTHORIZED');
      }
      const userObject = { name, email, department, password, isActive, isAdmin };
      const user = await createNewMember(userObject);
      return res.status(201).send(user);
    } catch (err) {
      return next(err);
    }
  }

  async signInUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new HttpException(400, USER_ERROR_CODES.SIGN_IN_BAD_REQUEST, 'SIGN_IN_BAD_REQUEST', null, null);
      }
      const user = await User.findByCredentials(email, password);

      if (!user) {
        throw new HttpException(404, USER_ERROR_CODES.SIGN_IN_FAIL, 'SIGN_IN_FAIL', null, null);
      }
      const userToken = await user.getAuthToken();
      return res.status(200).send({ user, accessToken: userToken });
    } catch (err) {
      return next(err);
    }
  }

  async sendMsg(req: Request, res: Response, next: NextFunction) {
    try {
      const url = 'https://51d8-43-241-145-222.ngrok.io/saas/general';
      const options = {
        headers: {
          Authorization:
            'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjYyMmYwNmM1M2NmYTZjM2IwNDgyY2MxNCIsInYiOiJLMTNqc2crbiIsImlhdCI6MTY1NTEyMDc2NCwiZXhwIjoxNjU1MjkzNTY0fQ.EWqszV5Z2RI4qOxt-dvfr8pvcqPqBdsLnCEsBrD7tbaOk3yPVFdtFv3nRUe9M13fa9QkG69TfQSHLzxdIY-2CxF72eOxI6wsJOQ2yzkKJDzrmws6O8zERNKMUVRS0c6y3-WccNnOEv1pPIGPfsuX7wLGItSPYuWFP4Vc4j02mvI',
        },
      };
      const data = {
        type: 'message',
        messageType: 'text',
        text: 'hello',
        userId: '8844222333',
        userFields: {
          name: 'Deva',
          email: 'deva@mail.com',
          first_name: 'Dev',
          last_name: 'Garach',
        },
        channelId: 'whatsapp',
      };
      const data2 = {
        type: 'event',
        eventType: 'startLiveChat',
        liveChatConfig: {
          distributionType: 'random',
        },
        userFields: {
          name: 'jkjfkgjkjf',
          email: 'jkjfkgjkjf@mail.com',
          first_name: 'jkjfkgjkjf',
          last_name: 'jkjfkgjkjf',
        },
        channelId: 'whatsapp',
        userId: '8844222331',
      };
      axios.post(url, data, options);
      return res.status(200).send({ message: 'success' });
    } catch (err) {
      return next(err);
    }
  }

  async sendMsg2(req: Request, res: Response, next: NextFunction) {
    try {
      const url = 'https://51d8-43-241-145-222.ngrok.io/saas/general';
      const options = {
        headers: {
          Authorization:
            'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjYyMmYwNmM1M2NmYTZjM2IwNDgyY2MxNCIsInYiOiJLMTNqc2crbiIsImlhdCI6MTY1NTEyMDc2NCwiZXhwIjoxNjU1MjkzNTY0fQ.EWqszV5Z2RI4qOxt-dvfr8pvcqPqBdsLnCEsBrD7tbaOk3yPVFdtFv3nRUe9M13fa9QkG69TfQSHLzxdIY-2CxF72eOxI6wsJOQ2yzkKJDzrmws6O8zERNKMUVRS0c6y3-WccNnOEv1pPIGPfsuX7wLGItSPYuWFP4Vc4j02mvI',
        },
      };
      const data = {
        type: 'message',
        messageType: 'text',
        text: 'hello',
        userId: '8844222331',
        channelId: 'whatsapp',
      };
      const data2 = {
        type: 'event',
        eventType: 'startLiveChat',
        liveChatConfig: {
          distributionType: 'random',
        },
        userFields: {
          name: 'Rajkot',
          email: 'gujarat@mail.com',
          first_name: 'rajkot',
          last_name: 'gujarat',
        },
        channelId: 'whatsapp',
        userId: '8844222331',
      };
      axios.post(url, data2, options);
      return res.status(200).send({ message: 'success' });
    } catch (err) {
      return next(err);
    }
  }

  async getMsg(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log('request==>', req);
      console.log('req.body==>', req.body);
      console.log('req.headers==>', req.headers);
      console.log('req.params==>', req.params);
      return res.status(200).send({ message: 'success' });
    } catch (err) {
      return next(err);
    }
  }
}
export default UserController;
