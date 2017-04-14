import { Component, OnDestroy, Input } from '@angular/core';
import * as wilddog from 'wilddog';
import {People} from '../people';
import {Item} from '../item';

@Component({
  selector: 'app-group-people-editor',
  templateUrl: './group-people-editor.component.html',
  styleUrls: ['./group-people-editor.component.css']
})
export class GroupPeopleEditorComponent implements OnDestroy {
  ref: any;
  itemsRef: any;
  _key: string;
  peopleKey: string;
  people: People;
  peoples: Map<string, People> = new Map<string, People>();
  keys: string[] = [];
  items: Map<string, Item> = new Map<string, Item>();
  itemKeys: string[] = [];
  isOpen: boolean = true;

  peopleName: string;
  peopleUid: string;

  @Input() isOwner: boolean = false;

  @Input()
  get key(): string {
    return this._key;
  }
  set key(value: string) {
    this._key = value;
    this.ref = wilddog.sync().ref('groups').child(this._key).child('peoples');
    this.ref.on('value', (snapshot) => {
      this.peoples.clear();
      this.keys = [];
      snapshot.forEach((childSnapshot) => {
        let tempKey = childSnapshot.key();
        this.keys.push(tempKey);
        this.peoples.set(tempKey, childSnapshot.val());
        if (!this.peoples.get(tempKey).buy) {
          this.peoples.get(tempKey).buy = new Map<string, number>();
        }
      });
      if (this.peopleKey) {
        this.people = this.peoples.get(this.peopleKey);
      }
      if (!this.isOwner) {
        this.checkUser();
      }
    });
    this.itemsRef = wilddog.sync().ref('groups').child(this._key).child('items');;
    this.itemsRef.on('value', (snapshot) => {
      this.items.clear();
      this.itemKeys = [];
      snapshot.forEach((childSnapshot) => {
        this.itemKeys.push(childSnapshot.key());
        this.items.set(childSnapshot.key(), childSnapshot.val());
      });
    });
    wilddog.sync().ref('groups').child(this._key).child('info/open').on('value', (snapshot) => {
      this.isOpen = snapshot.val();
    });
  }

  constructor() { }

  get currentUserId() {
    return wilddog.auth().currentUser ? wilddog.auth().currentUser.uid : null;
  }

  checkUser() {
    console.log(`checku ser`);
    let me = this.peoples.get(this.currentUserId);
    if (me != null) {
      this.people = me;
      this.peopleKey = this.currentUserId;
      console.log(`me`);
    }
  }

  ngOnInit() {
    wilddog.auth().onAuthStateChanged((user) => {
      if (user != null && !this.isOwner) {
        this.checkUser();
      }
    })
  }

  ngOnDestroy() {
    this.ref.off();
    this.itemsRef.off();
    wilddog.sync().ref('groups').child(this._key).child('info/open').off();
  }

  deletePeople(key: string) {
    this.ref.child(key).remove();
  }

  setPeopleKey(uid: string) {
    this.peoples.forEach((p, k) => {
      if (k == uid) {
        this.peopleKey = k;
        this.people = p;
        return;
      }
    });
  }

  addPeople() {
    if (this.isOwner && this.peopleUid) {
      // not owner. Can only add self
      this.setPeopleKey(this.peopleUid);
      if (!this.people) {
        this.ref.child(this.peopleUid).update({'name': this.peopleName}).then((newRef) => {
          this.setPeopleKey(this.peopleUid);
        });
      }
      return;
    }

    let name = this.peopleName;
    // check name
    if (name && name.trim() !== '') {
      name = name.trim();
      this.peopleKey = '';
      this.people = null;
      this.peoples.forEach((p, k) => {
        if (p.name === name) {
          this.peopleKey = k;
          this.people = p;
        }
      });
      if (!this.people) {
        this.ref.push({'name': name}).then((newRef) => {
          this.setPeopleKey(newRef.key());
        });
      }
    }
  }

  addMe() {
    this.setPeopleKey(this.currentUserId);
    if (this.people) {
      return;
    }
    this.ref.child(this.currentUserId)
      .update({'name': wilddog.auth().currentUser.displayName})
      .then((newRef) => {
        this.setPeopleKey(this.currentUserId);
    })
    .catch(function(err){
       console.info('Add node failed', err.code, err);
    });
  }

  editPeople(key: string) {
    this.peopleKey = key;
    if (this.peopleKey) {
      this.people = this.peoples.get(this.peopleKey);
    }
  }

  submit(peopleKey: string, itemKey: string, value: number) {
    this.ref.child(peopleKey).child('buy').child(itemKey).set(value);
  }

  close() {
    this.peopleKey = null;
    this.people = null;
  }
}
