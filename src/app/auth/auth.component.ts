import { Component, OnInit } from '@angular/core';
import * as wilddog from 'wilddog';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  email: string;
  password: string;

  constructor() {
    wilddog.auth().onAuthStateChanged((user) => {
      console.log(user);
    });
  }

  ngOnInit() {

  }

  get currentUser() {
    return wilddog.auth().currentUser;
  }

  registerWithEmail() {
    if (!this.email || !this.password) return;
    wilddog.auth().createUserWithEmailAndPassword(this.email, this.password);
  }

  signInWithEmail() {
    if (!this.email || !this.password) return;
    wilddog.auth().signInWithEmailAndPassword(this.email, this.password);
  }

  signInWithWeibo() {
    let provider = new wilddog.auth.WeiboAuthProvider();
    wilddog.auth().signInWithPopup(provider);
  }

  signOut() {
    wilddog.auth().signOut();
  }
}
