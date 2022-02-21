import * as mongoose from 'mongoose';
// import jwt from 'jsonwebtoken';
// import { encap } from '../src/services/helper';
// import Config from '../src/environments/index';
import Staff from '../src/components/staff/staff.model';

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'admin',
    email: 'admin@kevit.io',
    password: 'kevit@1234'
}
const userTwoId = new mongoose.Types.ObjectId();

const setupDatabase = async () => {
    // await Staff.deleteMany();
    // await new Staff(userOne).save()
}

export default {
    userOneId,
    userOne,
    userTwoId
}