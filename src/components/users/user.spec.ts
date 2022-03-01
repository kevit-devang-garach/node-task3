import request from 'supertest';
import app from '../../server';

import * as mongoose from 'mongoose';
// import jwt from 'jsonwebtoken';
// import { encap } from '../src/services/helper';
// import Config from '../src/environments/index';
// import Staff from '../src/components/staff/staff.model';

const userOneId = new mongoose.Types.ObjectId();
export const userOne = {
  email: 'devang.garach@kevit.io',
  password: 'Kevit@Rajkot2022',
};
const userTwoId = new mongoose.Types.ObjectId();

// const setupDatabase = async () => {
// await Staff.deleteMany();
// await new Staff(userOne).save()
// };

const calculateTip = (total: number, tipPercent = .2) => total + (total * tipPercent);
const fahrenheitToCelsius = (temp: number) => {
    return (temp -32) / 1.8;
}
const celsiusToFahrenheit = (temp: number) => {
    return (temp * 1.8) + 32;
}

const add = (a: number,b:number) => {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            if ( a < 0 || b < 0 ) {
                return reject("Number must be non-negative");
            }
            resolve(a+b)
        }, 2000);
    })
}

test('Should calculate total with default tip', () => {
    // const total = calculateTip(10);
    const total = add(10,10)
    expect(total).toBe(12);
})
