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
  ref: any;

  localItems: Item[] = [];
  localPeoples: People[] = [];

  constructor(private _route: ActivatedRoute) {
    _route.params.subscribe(p => {
      this.key = p['id'];
    });
  }

  /*calculate() {
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
  }*/

  ngOnInit() {
  }

}

export class GroupJoinComponent extends GroupEditorComponent {
  isOwner: boolean = false;
}
