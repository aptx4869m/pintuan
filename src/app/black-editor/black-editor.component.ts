import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Black, BlackNote} from '../black';
import {SnackbarService} from '../snackbar.service';
import * as wilddog from 'wilddog';

@Component({
  selector: 'app-black-editor',
  templateUrl: './black-editor.component.html',
  styleUrls: ['./black-editor.component.css']
})
export class BlackEditorComponent implements OnInit {
  ref: any;
  black: Black = new Black();
  _blackKey: string;

  @Output() closeChange: EventEmitter<void> = new EventEmitter<void>();
  @Input()
  get blackKey() { return this._blackKey; }
  set blackKey(key: string) {
    this._blackKey = key;
    this._fetchBlack();
  }

  moreVisible: boolean = false;

  blackDescriptions: string = '';

  @Input() isEditMode: boolean = false;
  editTag: string = '';

  constructor(private snackbar: SnackbarService) {}

  ngOnInit() {
  }

  get currentUser() {
    return wilddog.auth().currentUser ?
      wilddog.auth().currentUser.uid : null;
  }

  deleteTag(i: number) {
    this.black.tags.splice(i, 1);
  }

  addTag() {
    this.editTag = this.editTag.trim();
    if (!this.editTag) { return; }
    if (this.black.tags.includes(this.editTag)) { return; }
    this.black.tags.push(this.editTag);
    this.editTag = '';
  }


  addBlack() {
    let action;
    this.black.descriptions = this.blackDescriptions.split('\n');
    if (!this.blackKey) {
      action = wilddog.sync().ref('blacklists').child('list').push(this.black);
    } else {
      action = wilddog.sync().ref('blacklists').child('list').child(this.blackKey)
        .update(this.black);
    }
    action.then((_) => {
      this.snackbar.info('更新成功');
      this.close();
    })
    .catch((err) => this.snackbar.error(err));
  }

  close() {
    this.isEditMode = false;
    this._fetchBlack();
    this.closeChange.emit();
  }

  showMore() {
    this.moreVisible = !this.moreVisible;
  }

  _fetchBlack() {
    if (!this.blackKey) {
      this.black = new Black();
      this.blackDescriptions = '';
      this.isEditMode = true;
      return;
    }
    if (this.ref) {
      this.ref.off();
    }
    this.ref = wilddog.sync().ref('blacklists').child('list').child(this.blackKey);
    this.ref.on('value', (snapshot) => {
      this.black = snapshot.val() as Black;
      if (this.black.descriptions) {
        this.blackDescriptions = this.black.descriptions.join('\n');
      } else {
        this.blackDescriptions = '';
      }

    });
  }
}
