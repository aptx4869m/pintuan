import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MdSnackBar} from '@angular/material';
import * as wilddog from 'wilddog';
import {Collection} from '../collection';
import {AdminService} from '../admin.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {
  ref: any;
  groupKeys: string[];

  // create new Group
  newGroupName: string;
  newGroupImg: string;
  newGroupOpen: boolean = false;
  showCreateGroup: boolean = false;

  get isAdmin() { return this.adminService.isAdmin; }

  get currentUser() {
    return wilddog.auth().currentUser.uid;
  }

  constructor(public router: Router,
      public snackbar: MdSnackBar,
      public adminService: AdminService) {
    this.ref = wilddog.sync().ref('groups-list');
    this.ref.on('value', (snapshot) => {
      this.groupKeys = [];
      snapshot.forEach((childSnapshot) => {
        this.groupKeys.push(childSnapshot.key());
      });
      this.groupKeys = this.groupKeys.reverse();
    });
  }

  addGroup() {
    this.showCreateGroup = false;
    wilddog.sync().ref('groups').push({
      info: {
        owner: this.currentUser,
        name: this.newGroupName,
        img: this.newGroupImg,
        open: true,
        createdTime: wilddog.sync().ServerValue.TIMESTAMP
      }
    }).then((newRef) => {
      let key = newRef.key();
      if (this.newGroupOpen) {
        wilddog.sync().ref('groups-list').child(key)
          .set(wilddog.sync().ServerValue.TIMESTAMP).then(() => {
            this.router.navigateByUrl('/group-edit/' + key);
          });
      } else {
        this.router.navigateByUrl('/group-edit/' + key);
      }
    }).catch((err) => this.snackbar.open(`错误${err}`, null, {duration: 2000}));

  }

  ngOnInit() {
  }

}
