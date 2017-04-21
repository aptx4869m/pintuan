import { Component, OnInit } from '@angular/core';
import {Black, BlackNote} from '../black';
import {AdminService} from '../admin.service';
import {SnackbarService} from '../snackbar.service';
import * as wilddog from 'wilddog';

@Component({
  selector: 'app-black-list',
  templateUrl: './black-list.component.html',
  styleUrls: ['./black-list.component.css']
})
export class BlackListComponent implements OnInit {
  ref: any;
  showCreateBlack: boolean = false;
  blackKeys: string[];

  get isAdmin() { return this.admin.isAdmin; }

  constructor(public admin: AdminService, public snackbar: SnackbarService) {
    this.ref = wilddog.sync().ref('blacklists').child('list');
  }

  get currentUser() {
    return wilddog.auth().currentUser ?
      wilddog.auth().currentUser.uid : null;
  }

  ngOnInit() {
    this.ref.on('value', (snapshot) => {

      this.blackKeys = [];
      snapshot.forEach((childSnapshot) => {
        this.blackKeys.push(childSnapshot.key());
      });
    });
  }

  closeEditor() {
    this.showCreateBlack = false;
  }

  addClicked() {
    this.showCreateBlack = true;
    window.scrollTo(0, 0);
  }
}
