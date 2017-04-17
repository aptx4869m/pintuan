import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { Router} from '@angular/router';
import * as wilddog from 'wilddog';

import {AdminService} from '../admin.service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  displayName: string;
  photoURL: string;
  email: string;
  isAdmin: boolean = false;

  get currentUser() {
    return wilddog.auth().currentUser;
  }

  constructor(location: Location, router: Router, adminService: AdminService) {
    wilddog.auth().onAuthStateChanged((user) => {
      if (!user) {
        router.navigate(['/login'], { queryParams: { returnUrl: location.path() }});
      }
      adminService.checkGlobal().then((value) => this.isAdmin = value);
    });
  }

  ngOnInit() {
  }


  signOut() {
    wilddog.auth().signOut();
  }
}
