import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import * as wilddog from 'wilddog';

@Component({
  selector: 'app-user-picker',
  templateUrl: './user-picker.component.html',
  styleUrls: ['./user-picker.component.css']
})
export class UserPickerComponent implements OnInit {
  users: any[] = [];
  _selected: string;
  selectedUser: any;

　@Input() displayAvatar: boolean = true;
  @Input() hasNull: boolean = true;
  @Input() editable: boolean = true;

  @Input() set value(uid: string) {
    this._selected = uid;
    this.selectedUser = null;
    this.users.forEach((user) => {
      if (user.key == this._selected) {
        this.selectedUser = user;
        this.displayNameChange.emit(user.displayName);
      }
    });
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() displayNameChange: EventEmitter<string> = new EventEmitter<string>();

  set selected(selected: string) {
    this._selected = selected;
    this.valueChange.emit(this._selected);
    this.users.forEach((user) => {
      if (user.key == this._selected) {
        this.displayNameChange.emit(user.displayName);
      }
    });
  }

  get selected(): string {
    return this._selected;
  }
  constructor() { }

  ngOnInit() {
    wilddog.sync().ref('users').on('value', (snapshot) => {
      this.users = [];
      snapshot.forEach((childSnapshot) => {
        let user = childSnapshot.val();
        user.key = childSnapshot.key();
        this.users.push(user);
        if (user.key == this._selected) {
          this.selectedUser = user;
        }
      });
    });
  }

}
