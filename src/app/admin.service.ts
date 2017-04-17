import { Injectable } from '@angular/core';
import * as wilddog from 'wilddog';


@Injectable()
export class AdminService {

  constructor() { }

  checkGlobal() {
    return wilddog.sync().ref('admin').child('global')
      .once('value', (snapshot) => {
        return !!snapshot.val();

      })
      .catch((err) => {return false});
  }
}
