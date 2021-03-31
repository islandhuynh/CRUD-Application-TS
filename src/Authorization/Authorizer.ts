import { TokenGenerator, Account, SessionToken, TokenValidator, TokenRights, TokenState } from "../Server/Model";
import { SessionTokenDBAccess } from "./SessionTokenDBAccess";
import { UserCredentialsDBAccess } from "./UserCredentialsDBAccess";

export class Authorizer implements TokenGenerator, TokenValidator {

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

  public async validateToken(tokenId: string): Promise<TokenRights> {
    const token = await this.sessionTokenDBaccess.getToken(tokenId);
    if (!token || !token.valid) {
      return {
        accessRights: [],
        state: TokenState.INVALID
      }
    } else if (token.expirationTime < new Date()) {
      return {
        accessRights: [],
        state: TokenState.EXPIRED
      }
    }
    return {
      accessRights: token.accessRights,
      state: TokenState.VALID
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