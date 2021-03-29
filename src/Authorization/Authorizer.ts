import { TokenGenerator, Account, SessionToken } from "../Server/Model";
import { SessionTokenDBAccess } from "./SessionTokenDBAccess";
import { UserCredentialsDBAccess } from "./UserCredentialsDBAccess";

export class Authorizer implements TokenGenerator {

  private userCredDBAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess();
  private sessionTokenDBaccess: SessionTokenDBAccess = new SessionTokenDBAccess();

  async generateToken(account: Account): Promise<SessionToken | undefined> {
    const resultAccount = await this.userCredDBAccess.getUserCredentials(
      account.username, account.password
    );
    if (resultAccount) {
      const token: SessionToken = {
        accessRights: resultAccount.accessRights,
        expirationTime: this.generateExpirationTime(),
        username: resultAccount.username,
        valid: true,
        tokenId: this.generateRandomTokenId()
      }
      await this.sessionTokenDBaccess.storeSessionToken(token);
      return token;
    } else {
      return undefined;
    }
  }

  private generateExpirationTime() {
    return new Date(Date.now() + 1000 * 60 * 60)
  }

  private generateRandomTokenId() {
    // way to generate random strings
    return Math.random().toString(36).slice(2);
  }

}