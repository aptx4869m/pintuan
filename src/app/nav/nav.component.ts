import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { Router} from '@angular/router';
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

  constructor(location: Location, router: Router) {
    wilddog.auth().onAuthStateChanged((user) => {
      if (!user) {
        router.navigate(['/login'], { queryParams: { returnUrl: location.path() }});
      }
    });
  }

  ngOnInit() {
  }


  signOut() {
    wilddog.auth().signOut();
  }
}
