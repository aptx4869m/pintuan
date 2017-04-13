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
    });
    this.itemsRef = wilddog.sync().ref('groups').child(this._key).child('items');;
    this.itemsRef.on('value', (snapshot) => {
      this.items.clear();
      this.itemKeys = [];
      snapshot.forEach((childSnapshot) => {
        this.itemKeys.push(childSnapshot.key());
        this.items.set(childSnapshot.key(), childSnapshot.val());
      });
      console.log(this.itemKeys);
    });
    wilddog.sync().ref('groups').child(this._key).child('info/open').on('value', (snapshot) => {
      this.isOpen = snapshot.val();
    });
  }

  constructor() { }

  ngOnDestroy() {
    this.ref.off();
    this.itemsRef.off();
    wilddog.sync().ref('groups').child(this._key).child('info/open').off();
  }

  deletePeople(key: string) {
    this.ref.child(key).remove();
  }

  addPeople() {
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
          this.peopleKey = newRef.key();
          this.people = this.peoples.get(this.peopleKey);
        })
        .catch(function(err){
           console.info('Add node failed', err.code, err);
        });
      }
    }
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
