import { Component, OnInit } from '@angular/core';
import {MdSnackBar} from '@angular/material';
import * as wilddog from 'wilddog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  photoURL: string;
  displayName: string;

  constructor(public snackBar: MdSnackBar) { }

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
      this.snackBar.open('更新好了', null, {duration: 2000});
    })
    .catch((err) => {
      this.snackBar.open(`错误${err}`, null, {duration: 2000});
    });
  }
}
