import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
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
  returnUrl: string;

  constructor(router: Router, private route: ActivatedRoute) {
    wilddog.auth().onAuthStateChanged((user) => {
      if (user && !wilddog.auth().currentUser.displayName) {
        router.navigateByUrl('profile');
      } else if (user) {
        router.navigateByUrl(this.returnUrl);
      }
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    console.log(this.returnUrl);
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
