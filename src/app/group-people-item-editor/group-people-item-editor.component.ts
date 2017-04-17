import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MdSnackBar} from '@angular/material';
import * as wilddog from 'wilddog';

import {Item} from '../item';
import {People} from '../people';

@Component({
  selector: 'app-group-people-item-editor',
  templateUrl: './group-people-item-editor.component.html',
  styleUrls: ['./group-people-item-editor.component.css']
})
export class GroupPeopleItemEditorComponent implements OnInit {
  @Input() groupKey: string;

  @Input() itemKeys: string[];

  @Input() items:Map<string, Item>;

  _people: People;
  _oldPeople: People;
  @Input()
  get people() { return this._people; }
  set people(value: People) {
    this._people = value;
    if (!!value) {
      this._oldPeople = new People(value.name);
      this._oldPeople.copy(value);
    }
  }
  @Input() peopleKey: string;

  @Input() isOwner: boolean;

  @Input() isOpen: boolean;

  @Input() isEditMode: boolean = false;

  @Input() isTableView: boolean = false;

  @Output()
  submitChange: EventEmitter<null> = new EventEmitter<null>();

  @Output()
  cancelChange: EventEmitter<null> = new EventEmitter<null>();

  @Output()
  deleteChange: EventEmitter<string> = new EventEmitter<string>();


  get isEditable() {
    return (this.isOpen || this.isOwner);
  }
  constructor(public snackBar: MdSnackBar) { }

  ngOnInit() {
  }

  submit() {
    this.isEditMode = false;
    console.log(this.groupKey);
    console.log(this.peopleKey);
    if (this.peopleKey) {
      wilddog.sync().ref('groups').child(this.groupKey)
        .child('peoples').child(this.peopleKey).set(this.people)
        .then((newRef) => {
          this.snackBar.open('更新成功', null, {duration: 2000});
          this.submitChange.emit();
        }).catch((err) => this.snackBar.open(`错误: ${err}`, null, {duration: 2000}));
    } else {
      wilddog.sync().ref('groups').child(this.groupKey)
        .child('peoples').push(this.people)
        .then((newRef) => {
          this.peopleKey = newRef.key();
          this.snackBar.open('更新成功', null, {duration: 2000});
          this.submitChange.emit();
        }).catch((err) => this.snackBar.open(`错误: ${err}`, null, {duration: 2000}));
    }
  }

  deletePeople() {
    console.log(this.groupKey);
    wilddog.sync().ref('groups').child(this.groupKey)
      .child('peoples').child(this.peopleKey).remove()
      .then((newRef) => {
        this.snackBar.open('更新成功', null, {duration: 2000});
        this.deleteChange.emit(this.peopleKey);
      }).catch((err) => this.snackBar.open(`错误: ${err}`, null, {duration: 2000}))
  }

  close() {
    this.isEditMode = false;
    this._people.buy = this._oldPeople.buy;
    this.cancelChange.emit();
  }
}
