import { Types } from 'mongoose';

export default interface Member {
  name: string;
  department: string;
  email: string;
  password: string;
}
