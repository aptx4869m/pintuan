import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Black} from '../black';
import {SnackbarService} from '../snackbar.service';
import * as wilddog from 'wilddog';

@Component({
  selector: 'app-black-editor',
  templateUrl: './black-editor.component.html',
  styleUrls: ['./black-editor.component.css']
})
export class BlackEditorComponent implements OnInit {
  ref: any;
  @Input() editBlack: Black;
  @Output() closeChange: EventEmitter<void> = new EventEmitter<void>();

  editTag: string = '';
  editDescription: string = '';
  indexDescription = -1;

  constructor(private snackbar: SnackbarService) {
    this.ref = wilddog.sync().ref('blacklists').child('list');
  }

  ngOnInit() {
  }

  modifyDescription(i: number) {
    this.indexDescription = i;
    this.editDescription = this.editBlack.descriptions[i];
  }

  deleteDescription(i: number) {
    this.indexDescription = -1;
    this.editBlack.descriptions.splice(i, 1);
  }

  addDescription() {
    if (this.indexDescription == -1) {
      this.editBlack.descriptions.push(this.editDescription);
    } else {
      this.editBlack.descriptions[this.indexDescription] = this.editDescription;
      this.indexDescription = -1;
    }
    this.editDescription = '';
  }

  deleteTag(i: number) {
    this.editBlack.tags.splice(i, 1);
  }

  addTag() {
    this.editTag = this.editTag.trim();
    if (!this.editTag) { return; }
    if (this.editBlack.tags.includes(this.editTag)) { return; }
    this.editBlack.tags.push(this.editTag);
    this.editTag = '';
  }

  addBlack() {
    if (!this.editBlack.key) {
      this.ref.push(this.editBlack)
        .then((_) => this.snackbar.info('更新成功'))
        .catch((err) => this.snackbar.error(err));
    } else {
      this.ref.child(this.editBlack.key)
        .update(this.editBlack)
        .then((_) => this.snackbar.info('更新成功'))
        .catch((err) => this.snackbar.error(err));
    }
    this.closeChange.emit();
  }
}
