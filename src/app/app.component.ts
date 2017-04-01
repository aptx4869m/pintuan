import {Component, ViewChild} from '@angular/core';
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
  items: Item[] = [];
  peoples: People[] = [];
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  isOwner: boolean = true;
  collection: Collection = new Collection();
  currentPeople: People;
  ref = wilddog.sync().ref();

  constructor() {  }
  
  deleteItem(name: string) {
    console.log(name);
    let index = -1;
    this.collection.items.forEach((item, i) => {
      if (item.name === name) {
        index = i;
      }
    });
    if (index > -1) {
      console.log(index);
      this.collection.items.splice(index, 1);
    }
    this.collection.peoples.forEach((p) => {
      delete p.buy[name]
    });
  }
  
  addItem(name: string) {
    // check name
    if (name && name.trim() !== '') {
      name = name.trim();
      let notexists = this.collection.items.filter((i) => i.name === name).length == 0;
      console.log(notexists);
      if (notexists) {
        this.collection.items.push(new Item(name));
      }
    }
  }
  
  addPeople(name: string) {
    if (name && name.trim() !== '') {
      let matches = this.collection.peoples.filter((i) => i.name === name);
      if (matches.length == 0) {
        let newPeople = new People(name);
        this.collection.peoples.push(newPeople);
        if (!this.isOwner) {
          this.currentPeople = newPeople;
        }
      } else if (!this.isOwner) {
        this.currentPeople = matches[0];
      }
    }
  }
  
  deletePeople(name: string) {
    console.log(name);
    let index = -1;
    this.collection.peoples.forEach((people, i) => {
      if (people.name === name) {
        index = i;
      }
    });
    if (index > -1) {
      console.log(index);
      this.collection.peoples.splice(index, 1);
    }
    if (this.currentPeople.name === name) {
      this.currentPeople = null;
    }
  }
  
  submit() {
    this.calculate();
    if (this.isOwner) {
      console.log(this.collection);
    } else if (this.currentPeople) {
      let matches = this.collection.peoples.filter((p) => p.name === this.currentPeople.name);
      console.log(matches);
    }
    
  }
  
  calculate() {
    this.collection.peoples.forEach((people) => {
      people.total = 0;
    }); 
    this.collection.items.forEach((item) => {
      item.total = 0;
    });
    this.collection.items.forEach((item) => {
      this.collection.peoples.forEach((people) => {
        let numberItems = people.buy[item.name];
        if (numberItems) {
          item.total += numberItems;
          people.total += item.price * numberItems;
        }
      });
    })
  }
}

