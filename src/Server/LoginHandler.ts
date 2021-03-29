import { IncomingMessage, ServerResponse } from 'http';
import { HTTP_CODES, HTTP_METHODS } from '../Shared/Model';
import { Account, Handler, TokenGenerator } from './Model';

export class LoginHandler implements Handler {

  private req: IncomingMessage;
  private res: ServerResponse;
  private TokenGenerator: TokenGenerator;

  public constructor(req: IncomingMessage, res: ServerResponse, TokenGenerator: TokenGenerator) {
    this.req = req;
    this.res = res;
    this.TokenGenerator = TokenGenerator;
  };

  public async handleRequest(): Promise<void> {

    switch (this.req.method) {
      case HTTP_METHODS.POST:
        await this.handlePost();
        break;

      default:
        this.handleNotFound();
        break
    }
  }

  private async handleNotFound() {
    this.res.statusCode = HTTP_CODES.NOT_FOUND;
    this.res.write('Not Found');
  }

  private async handlePost() {
    try {
      const body = await this.getRequestBody();
      const sessionToken = await this.TokenGenerator.generateToken(body);
      if (sessionToken) {
        this.res.statusCode = HTTP_CODES.CREATED,
          this.res.writeHead(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' }),
          this.res.write(JSON.stringify(sessionToken));
      } else {
        this.handleNotFound();
      }
    } catch (error) {
      this.res.write('err: ' + error.message);
    }
  }

  private async getRequestBody(): Promise<Account> {
    return new Promise((resolve, reject) => {
      let body = '';
      this.req.on('data', (data: string) => {
        body += data;
      });
      this.req.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
      this.req.on('error', (error: any) => {
        reject(error);
      })
    });
  }
}