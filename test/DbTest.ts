import { UserCredentialsDBAccess } from "../src/Authorization/UserCredentialsDBAccess";
import { UsersDBAccess } from "../src/User/UsersDBAccess";

class DbTest {

  public dbAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess();
  public UserDbAcess: UsersDBAccess = new UsersDBAccess();

}

new DbTest().dbAccess.putUserCredentials({
  username: 'island',
  password: '1234',
  accessRights: [0, 1, 2, 3]
});

// new DbTest().UserDbAcess.putUser({
//   age: 30,
//   email: 'test@gmail.com',
//   id: 'abd123',
//   name: 'Island Test',
//   workingPosition: 3
// });