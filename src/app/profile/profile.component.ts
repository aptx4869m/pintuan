import { Component, OnInit } from '@angular/core';
import * as wilddog from 'wilddog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  photoURL: string;
  displayName: string;

  constructor() { }

  ngOnInit() {
    wilddog.auth().onAuthStateChanged((user) => {
      this.photoURL = user.photoURL;
      this.displayName = user.displayName;
    });
  }

  updateProfile() {

    let profile = {
      'photoURL': this.photoURL,
      'displayName': this.displayName
    };
    wilddog.auth().currentUser.updateProfile(profile)
    .then((user) => {
      wilddog.sync().ref('users').child(user.localId).set( {
        'photoURL': this.photoURL,
        'displayName': this.displayName,
        'email': wilddog.auth().currentUser.email
      });
      console.info('update user ->', user);
    })
    .catch((err) => {
        console.info("update user info failed.", err);
    });
  }
}
