import {Component, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as wilddog from 'wilddog';

class Item {
  name: string = '';
  img: string = '';
  price: number = 0;
  stock: number= 0;
  total: number = 0;
  
  constructor(name: string) {
    this.name = name;
  }
}

class People {
  name: string = '';
  buy: Map<string, number> = new Map<string, number>();
  
  constructor(name: string) {
    this.name = name;
  }
  total: number = 0;
}

class Collection {
  name: string = '';
  description: string = '';
  img: string = '';
  rate: number = 1;
  items: Map<string, Item> = new Map<string, Item>();
  peoples: Map<string, People> = new Map<string, People>();
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  isOwner: boolean = true;
  collection: Collection = new Collection();
  currentPeople: People;
  key: string;
  ref = wilddog.sync().ref();

  constructor(private _route: ActivatedRoute) {
    _route.params.subscribe(p => {
      this.key = p['id'];
    });
  }
  
  deleteItem(name: string) {
    delete this.collection.items[name];
    this.collection.peoples.forEach((p) => {
      delete p.buy[name]
    });
  }
  
  addItem(name: string) {
    // check name
    if (name && name.trim() !== '') {
      name = name.trim();
      if (!this.collection.items[name]) {
        this.collection.items[name] = new Item(name);
      }
    }
  }
  
  addPeople(name: string) {
    if (name && name.trim() !== '') {
      let match = this.collection.peoples[name];
      if (!match) {
        match = new People(name);
        this.collection.peoples[name] = match;
      }
      if (!this.isOwner) {
        this.currentPeople = match;
      }
    }
  }
  
  deletePeople(name: string) {
    console.log(name);
    delete this.collection.peoples[name];
    if (this.currentPeople.name === name) {
      this.currentPeople = null;
    }
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
}

