import { Component, OnDestroy, Input } from '@angular/core';
import * as wilddog from 'wilddog';
import {MdSnackBar} from '@angular/material';
import {People} from '../people';
import {Item} from '../item';

@Component({
  selector: 'app-group-people-editor',
  templateUrl: './group-people-editor.component.html',
  styleUrls: ['./group-people-editor.component.css']
})
export class GroupPeopleEditorComponent implements OnDestroy {
  // this group related
  ref: any;
  _key: string;
  isOpen: boolean = false;
  // items
  itemsRef: any;
  items: Map<string, Item> = new Map<string, Item>();
  itemKeys: string[] = [];

  peopleKey: string;
  people: People;
  // people summary info
  peoples: Map<string, People> = new Map<string, People>();
  peopleKeys: string[] = [];
  peopleName: string;

  isEditMode: boolean = false;

  @Input() isOwner: boolean = false;

  @Input()
  get key(): string {
    return this._key;
  }
  set key(value: string) {
    this._key = value;
    this._fetchPeoples();
    this._fetchItems();
    this._fetchOpenInfo();
  }

  constructor(public snackbar: MdSnackBar) { }

  get currentUserId() {
    return wilddog.auth().currentUser ? wilddog.auth().currentUser.uid : null;
  }

  ngOnInit() {
    wilddog.auth().onAuthStateChanged((user) => {
      this.checkUser();
    })
  }

  checkUser() {
    let user = wilddog.auth().currentUser;
    if (user != null && !this.isOwner) {
      this.setPeopleKeyName(user.uid, user.displayName);
    }
  }

  ngOnDestroy() {
    this.ref.off();
    this.itemsRef.off();
    wilddog.sync().ref('groups').child(this._key).child('info/open').off();
  }

  deletePeople(key: string) {
    this.ref.child(key).remove();
  }

  setPeopleKeyName(uid: string, name: string) {
    this.peoples.forEach((v, k) => {
      if ((!!uid && k == uid) || (!!name && v.name == name)) {
        this.peopleKey = k;
        this.people = v;
        this.isEditMode = true;
        return;
      }
    });
  }

  _processPeopleName() {
    if (!!this.peopleName && this.peopleName.trim() !== '') {
      this.peopleName = this.peopleName.trim();
    } else {
      this.peopleName = null;
    }
  }

  addPeople() {
    if (!this.isOwner) {
      return;
    }
    this.people = null;
    this._processPeopleName();
    console.log(this.peopleKey);
    console.log(this.peopleName);
    this.setPeopleKeyName(this.peopleKey, this.peopleName);

    if (!this.people) {
      this._addPeople(this.peopleKey, this.peopleName);
    }
  }

  addMe() {
    this.peopleKey = wilddog.auth().currentUser.uid;
    this.peopleName = wilddog.auth().currentUser.displayName;
    this.setPeopleKeyName(this.peopleKey, this.peopleName);
    if (!this.people) {
      this._addPeople(this.peopleKey, this.peopleName);
    }
  }

  _addPeople(uid: string, name: string) {
    let action;
    if (!!uid && !!name) {
      action = this.ref.child(uid).set({name: name}).then((newRef) => {
        this.setPeopleKeyName(uid, name);
        this.snackbar.open(`${name} 已参团`, null, {duration: 2000});
        this.isEditMode = true;
      });
    } else if (!!name){
      action = this.ref.push({name: name}).then((newRef) => {
        console.log(newRef);

        this.setPeopleKeyName(newRef.key(), null);
        this.snackbar.open(`${name} 已参团`, null, {duration: 2000});
        this.isEditMode = true;
      });
    }
    if (!!action) {
      action.catch((err) => {
        this.snackbar.open(`错误: ${err}`, null, {duration: 2000});
      });
    }
  }

  editPeople(key: string) {
    this.setPeopleKeyName(key, null);
    this.isEditMode = true;
  }

  submit(peopleKey: string, itemKey: string, value: number) {
    this.ref.child(peopleKey).child('buy').child(itemKey).set(value);
  }

  close() {
    if (this.isOwner) {
      this._clear();
    }
  }

  onDelete(key: string) {
    if (!this.isOwner && wilddog.auth().currentUser.uid === key) {
      this._clear();
    }
  }

  _clear() {
    this.peopleKey = null;
    this.people = null;
    this.peopleName = null;
  }

  _fetchOpenInfo() {
    wilddog.sync().ref('groups').child(this._key).child('info/open').on('value', (snapshot) => {
      this.isOpen = snapshot.val();
    });
  }

  _fetchItems() {
    this.itemsRef = wilddog.sync().ref('groups').child(this._key).child('items');;
    this.itemsRef.on('value', (snapshot) => {
      this.items.clear();
      this.itemKeys = [];
      snapshot.forEach((childSnapshot) => {
        this.itemKeys.push(childSnapshot.key());
        this.items.set(childSnapshot.key(), childSnapshot.val());
      });
    });
  }

  _fetchPeoples() {
    this.ref = wilddog.sync().ref('groups').child(this._key).child('peoples');
    this.ref.on('value', (snapshot) => {
      this.peoples.clear();
      this.peopleKeys = [];
      snapshot.forEach((childSnapshot) => {
        let tempKey = childSnapshot.key();
        this.peopleKeys.push(tempKey);
        this.peoples.set(tempKey, childSnapshot.val());
        if (!this.peoples.get(tempKey).buy) {
          this.peoples.get(tempKey).buy = new Map<string, number>();
        }
        this.checkUser();
      });
    });
  }
}
