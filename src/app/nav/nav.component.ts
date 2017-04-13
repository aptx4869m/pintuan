import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as wilddog from 'wilddog';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  displayName: string;
  photoURL: string;
  email: string;

  get currentUser() {
    return wilddog.auth().currentUser;
  }

  constructor(router: Router) {
    wilddog.auth().onAuthStateChanged((user) => {
      if (!user) {
        router.navigateByUrl('/register');
      }
    });
  }

  ngOnInit() {
  }


  signOut() {
    wilddog.auth().signOut();
  }
}
