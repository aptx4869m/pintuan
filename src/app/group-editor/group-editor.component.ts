import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as wilddog from 'wilddog';

import {Collection} from '../collection';
import {Item} from '../item';
import {People} from '../people';

@Component({
  selector: 'app-group-editor',
  templateUrl: './group-editor.component.html',
  styleUrls: ['./group-editor.component.css']
})
export class GroupEditorComponent implements OnInit {
  isOwner: boolean = true;
  collection: Collection = new Collection();
  savedCollection: Collection;
  currentPeople: People;
  key: string;
  ref = wilddog.sync().ref();

  localItems: Item[] = [];
  localPeoples: People[] = [];

  constructor(private _route: ActivatedRoute) {
    _route.params.subscribe(p => {
      this.key = p['id'];

      this.ref.child(this.key).on('value', (snapshot) => {
        if (snapshot.val()) {
          this.collection = new Collection(snapshot.val());
          this._calculateItems();
          this._calculatePeoples();
        }
      });
    });
  }

  deleteItem(name: string) {
    this.collection.items.set(name, null);
    this.collection.peoples.forEach((p) => {
      p.buy.set(name, null)
    });
    this._calculateItems();
  }

  addItem(name: string) {
    // check name
    if (name && name.trim() !== '') {
      name = name.trim();
      if (!this.collection.items.get(name)) {
        console.log(name);
        this.collection.items.set(name, new Item(name));
      }
    }
    console.log(this.collection.items);
    this._calculateItems();
  }

  addPeople(name: string) {
    if (name && name.trim() !== '') {
      let match = this.collection.peoples.get(name);
      if (!match) {
        match = new People(name);
        this.collection.peoples.set(name, match);
      }
      if (!this.isOwner) {
        this.currentPeople = match;
      }
    }
    this._calculatePeoples();
  }

  deletePeople(name: string) {
    console.log(name);
    this.collection.peoples.set(name, null);
    if (this.currentPeople.name === name) {
      this.currentPeople = null;
    }
    this._calculatePeoples();
  }

  submit() {
    this.calculate();
    if (this.isOwner) {
      this.ref.child(this.key).update(this.collection);
    } else if (this.currentPeople) {
      this.ref.child(this.key).child('peoples').child(this.currentPeople.name).update(this.currentPeople);
    }

  }

  calculate() {
    this.collection.peoples.forEach((people, name) => {
      people.total = 0;
    });
    this.collection.items.forEach((item, name) => {
      item.total = 0;
    });
    this.collection.items.forEach((item, name) => {
      this.collection.peoples.forEach((people, name) => {
        let numberItems = people.buy[item.name];
        if (numberItems) {
          item.total += numberItems;
          people.total += item.price * numberItems;
        }
      });
    })
  }

  _calculateLocalItems() {
    this.localItems.forEach((item) => {
      this.collection.items.set(item.name, item);
    });
  }

  _calculateLocalPeoples() {

    this.localPeoples.forEach((people) => {
      this.collection.peoples.set(people.name, people);
    });
  }

  _calculateItems() {
    let items = [];
    this.collection.items.forEach((item, name) => {
      console.log(item);
      items.push(item);
    });
    this.localItems = items;
  }

  _calculatePeoples() {
    this.localPeoples = [];
    this.collection.peoples.forEach((people, name) => {
      this.localPeoples.push(people);
    });
  }

  ngOnInit() {
  }

}

export class GroupJoinComponent extends GroupEditorComponent {
  isOwner: boolean = false;
}
