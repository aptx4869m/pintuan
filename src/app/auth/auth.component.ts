import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as wilddog from 'wilddog';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  email: string;
  password: string;
  error: string;

  constructor(router: Router) {
    wilddog.auth().onAuthStateChanged((user) => {
      if (user) {
        router.navigateByUrl('profile');
      }
    });
  }

  ngOnInit() {

  }

  get currentUser() {
    return wilddog.auth().currentUser;
  }

  registerWithEmail() {
    if (!this.email || !this.password) return;
    this.error = null;
    wilddog.auth().createUserWithEmailAndPassword(this.email, this.password)
      .catch((error) => {
        this.error = error.message;
      });
  }

  signInWithEmail() {
    if (!this.email || !this.password) return;
    this.error = null;
    wilddog.auth().signInWithEmailAndPassword(this.email, this.password)
      .catch((error) => {
        this.error = error.message;
      });
  }
}
