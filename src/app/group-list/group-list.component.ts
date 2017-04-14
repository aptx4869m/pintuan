import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  newGroupKey: string;
  newGroupName: string;
  newGroupImg: string;
  showCreateGroup: boolean = false;

  get currentUser() {
    return wilddog.auth().currentUser.uid;
  }

  constructor(public router: Router) {
    this.ref = wilddog.sync().ref('groups');
    this.ref.on('value', (snapshot) => {
      this.groups = [];
      snapshot.forEach((childSnapshot) => {
        let group = childSnapshot.val().info as Collection;
        group.key = childSnapshot.key();
        console.log(group.key);
        this.groups.push(group);
      })
    });
  }

  addGroup() {
    this.showCreateGroup = false;
    let key = this.ref.child(this.newGroupKey).set({
      owner: this.currentUser,
      name: this.newGroupName,
    }).key;
    this.router.navigateByUrl('/group/' + key);
  }

  ngOnInit() {
  }

}
