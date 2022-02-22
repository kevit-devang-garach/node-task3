import App from './app';
import DepartmentRoute from './components/departments/department.routes';
import UserRoute from './components/users/user.routes';

import { encap } from './services/helper';

// (async function run () {
//     const password1 = await encap.hash("123456")
//     const password2 = await encap.hash("123456")
//     console.log("passord1",typeof password1,"password2", typeof password2)
//     console.log("password1", await encap.verify("123456", password1));
//     console.log("password2", await encap.verify("123456", '7b83a578b87ddfa0:d84702fea253c27202dbbdf9daac8ec78b7ddd71e0e7da68f10ee89c44d7bce478120329838db36a45f68e29734c0c8159d6ac11cf1b5475037128ba001d09be'));
//     // password 1 & 2 both will be same as we're using same salt
//     console.log("password1 == password2", password1 == password2, password1,password2);
// })()
const app = new App([new DepartmentRoute(), new UserRoute()]);

app.listen();

export default app;