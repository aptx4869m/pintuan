import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import {MdSnackBar} from '@angular/material';
import * as wilddog from 'wilddog';
import {Collection} from '../collection';
import {AdminService} from '../admin.service';
@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.css']
})
export class GroupCardComponent implements OnInit {
  group: Collection;
  _groupKey: string;
  @Input()
  get groupKey() { return this._groupKey; }
  set groupKey(value: string) {
    this._groupKey = value;
    this._loadGroup();
  }
  ref: any;
  get isAdmin() { return this.adminService.isAdmin; }

  get currentUser() {
    return wilddog.auth().currentUser.uid;
  }

  constructor(public router: Router,
      public snackbar: MdSnackBar,
      public adminService: AdminService) {}

  ngOnInit() {}

  _loadGroup() {
    if (this.groupKey) {
      this.ref = wilddog.sync().ref('groups').child(this.groupKey).child('info');
      this.ref.on('value', (snapshot) => {
        this.group = snapshot.val() as Collection;
      });
    }
  }
}
