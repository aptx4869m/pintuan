import {Item} from './item';
import {People} from './people';

export class Collection {
  name: string = '';
  description: string = '';
  img: string = '';
  rate: number = 1;
  items: Map<string, Item> = new Map<string, Item>();
  peoples: Map<string, People> = new Map<string, People>();
  open: boolean = true;
  key: string;

  constructor(value?: any) {
    if (value) {
      if (value.name) this.name = value.name;
      if (value.description) this.description = value.description;
      if (value.img) this.img = value.img;
      if (value.rate) this.rate = value.rate;
      if (value.items) this.items = value.items;
      if (value.peoples) {
        this.peoples = value.people;
        this.peoples.forEach((people, name) => people.initialize());
      }
      if (value.open === true || value.open === false) {
        this.open = value.open;
      }
    }
  }

  initialize() {
    if (!this.name) this.name = '';
    if (!this.description) this.description = '';
    if (!this.img) this.img = '';
    if (!this.rate) this.rate = 1;
    if (!this.items) this.items = new Map<string, Item>();
    if (!this.peoples) this.peoples = new Map<string, People>();
    this.peoples.forEach((people, name) => people.initialize());
  }
}
