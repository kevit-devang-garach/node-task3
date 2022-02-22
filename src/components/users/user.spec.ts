import request from 'supertest';
import app  from '../../server';
import Staff from './user.model';
const { userOne } = require('../../../test/db');

test('Should login existing user', async () => {
    const response = await request(app).post('/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    // Asserstions about the response
})