import { UserCredentials } from "../Shared/Model";
import * as Nedb from 'nedb';

export class UserCredentialsDBAccess {

  private nedb: Nedb;

  constructor() {
    this.nedb = new Nedb('database/UserCredentials.db');
    this.nedb.loadDatabase();
  }

  public async putUserCredentials(userCredentials: UserCredentials): Promise<any> {
    return new Promise((resolve, reject) => {
      this.nedb.insert(userCredentials, (error: Error | null, docs: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(docs);
        }
      })
    })
  }

  public async getUserCredentials(username: string, password: string): Promise<UserCredentials | undefined> {
    return new Promise((resolve, reject) => {
      this.nedb.find({ username: username, password: password }, (error: Error, docs: UserCredentials[]) => {
        if (error) {
          reject(error);
        } else {
          if (docs.length === 0) {
            resolve(undefined);
          } else {
            resolve(docs[0]);
          }
        }
      })
    });
  }
}