
import request from 'supertest';
import app from '../../server';
// let app = require('../../server').default;
console.log("emvironment",process.env);
export const userOne = {
  email: 'devang.garach@kevit.io',
  password: 'Kevit@Rajkot2022',
};

describe("POST /sign-in", () => {
    test("when passed a username and password", async() => {
        const response = await request(app)
              .post('/login')
              .send({
                email: userOne.email,
                password: userOne.password,
              })
              .expect(200);
    })
    describe("when the username or password is missing", () => {})
})
// test('Should login existing user', async () => {
//     const response = await request(app)
//       .post('/login')
//       .send({
//         email: userOne.email,
//         password: userOne.password,
//       })
//       .expect(200);
//     // Asserstions about the response
//   });


