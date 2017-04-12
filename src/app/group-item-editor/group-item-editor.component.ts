import { Component, OnDestroy, Input } from '@angular/core';
import * as wilddog from 'wilddog';
import {Item} from '../item';


@Component({
  selector: 'app-group-item-editor',
  templateUrl: './group-item-editor.component.html',
  styleUrls: ['./group-item-editor.component.css']
})
export class GroupItemEditorComponent implements OnDestroy {
  ref: any;
  _key: string;
  itemKey: string;
  item: Item;
  items: Map<string, Item> = new Map<string, Item>();
  keys: string[] = [];
  @Input() isOwner: boolean = false;

  constructor() { }

  ngOnDestroy() {
    this.ref.off();
  }

  @Input()
  get key(): string {
    return this._key;
  }
  set key(value: string) {
    this._key = value;
    this.ref = wilddog.sync().ref('groups').child(this._key).child('items');
    this.ref.on('value', (snapshot) => {
      this.items.clear();
      this.keys = [];
      snapshot.forEach((childSnapshot) => {
        this.keys.push(childSnapshot.key());
        this.items.set(childSnapshot.key(), childSnapshot.val());
      });
      if (this.itemKey) {
        this.item = this.items.get(this.itemKey);
      }
    });
  }

  deleteItem(key: string) {
    this.ref.child(key).remove();
  }

  addItem(name: string) {
    // check name
    if (name && name.trim() !== '') {
      name = name.trim();
      this.ref.push({'name': name}).then((newRef) => {
        this.itemKey = newRef.key();
        this.item = this.items.get(this.itemKey);
      })
      .catch(function(err){
         console.info('Add node failed', err.code, err);
      });
    }
  }

  editItem(key: string) {
    this.itemKey = key;
    if (this.itemKey) {
      this.item = this.items.get(this.itemKey);
    }
  }

  submit() {
    if (!this.item.name) return;
    this.ref.child(this.itemKey).update({
      'name' : this.item.name,
      'price': this.item.price || 0,
      'img': this.item.img || '',
      'stock': this.item.stock || 0
    })
  }

  close() {
    this.item = null;
    this.itemKey = null;
  }
}
