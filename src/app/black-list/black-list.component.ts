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
  editBlack: Black = new Black();
  showCreateBlack: boolean = false;
  blacks: Black[];
  blackMap: Map<string, Black>;

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
      this.blackMap = new Map<string, Black>();
      this.blacks = [];
      snapshot.forEach((childSnapshot) => {
        let black = childSnapshot.val();
        black.key = childSnapshot.key();
        if (!black.tags) black.tags = [];
        if (!black.descriptions) black.descriptions = [];
        this.blacks.push(black);
        this.blackMap.set(black.key, black);
      });
    });
  }

  showMore(key: string) {
    wilddog.sync().ref('blacklists').child('details').child(key).once('value', (snapshot) => {
      let notes: BlackNote[] = [];
      snapshot.forEach((childSnapshot) => {
        let note = childSnapshot.val() as BlackNote;
        notes.push(note);
      });
      this.blackMap.get(key).notes = notes;
    })
  }

  closeEditor() {
    this.showCreateBlack = false;
    this.editBlack = new Black();
  }
}
