import { Injectable } from '@angular/core';
import * as wilddog from 'wilddog';


@Injectable()
export class AdminService {
  isAdmin: boolean = false;

  constructor() {
    wilddog.auth().onAuthStateChanged((user) => {
      if (user) {
      wilddog.sync().ref('admin').child('global')
        .child(wilddog.auth().currentUser.uid)
        .once('value', (snapshot) => {
          this.isAdmin = !!snapshot.val();

        })
        .catch((err) => { this.isAdmin = false; });
      }
    })
  }
}
