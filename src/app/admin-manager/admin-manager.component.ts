import { Component, OnInit, OnDestroy } from '@angular/core';
import {MdSnackBar} from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as wilddog from 'wilddog';

@Component({
  selector: 'app-admin-manager',
  templateUrl: './admin-manager.component.html',
  styleUrls: ['./admin-manager.component.css']
})
export class AdminManagerComponent implements OnInit {
  peopleKey: string = null;
  users: string[];
  key: string;


  constructor(public snackbar: MdSnackBar, private _route: ActivatedRoute) {
    _route.params.subscribe(p => {
      this.key = p['id'];
    });
  }

  ngOnInit() {
    let ref =  wilddog.sync().ref('admin').child(this.key);
    ref.on('value', (snapshot) => {
      this.users = [];
      snapshot.forEach((childSnapshot) => {
        let uid = childSnapshot.key();
        this.users.push(uid);
      })
    });
  }

  ngOnDestroy() {
    wilddog.sync().ref('admin').child(this.key).off();
  }

  updateAdmin(key: string, value: boolean) {
    wilddog.sync().ref('admin').child(this.key).child(key)
      .set(value === true ? true : null)
      .then((_) => this.snackbar.open('更新成功', null, {duration: 2000}))
      .catch((err) => this.snackbar.open(`错误: ${err}`, null, {duration: 2000}));
  }

  get authText() {
    return this.users  ?
      this.users.map((user) => `auth.uid == '${user}'`).join(' || ') : '';
  }

  addPeople() {
    this.updateAdmin(this.peopleKey, true);
  }

  deletePeople(key: string) {
    this.updateAdmin(key, false);
  }
}
