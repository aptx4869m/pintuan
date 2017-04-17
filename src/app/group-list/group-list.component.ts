import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MdSnackBar} from '@angular/material';
import * as wilddog from 'wilddog';
import {Collection} from '../collection';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {
  ref: any;
  groups: Collection[];

  // create new Group
  newGroupName: string;
  newGroupImg: string;
  showCreateGroup: boolean = false;

  get currentUser() {
    return wilddog.auth().currentUser.uid;
  }

  constructor(public router: Router, public snackbar: MdSnackBar) {
    this.ref = wilddog.sync().ref('groups');
    this.ref.on('value', (snapshot) => {
      this.groups = [];
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot) {

          let group = childSnapshot.val().info as Collection;
          if (group) {
            group.key = childSnapshot.key();
            this.groups.push(group);
          }
        }
      })
    });
  }

  addGroup() {
    this.showCreateGroup = false;
    this.ref.push({
      info: {
        owner: this.currentUser,
        name: this.newGroupName,
      }
    }).then((newRef) => {
      this.router.navigateByUrl('/group/' + newRef.key());
    }).catch((err) => this.snackbar.open(`错误${err}`, null, {duration: 2000}));

  }

  ngOnInit() {
  }

}
