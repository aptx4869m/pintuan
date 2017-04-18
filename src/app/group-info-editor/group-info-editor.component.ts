import { Component, OnDestroy, Input } from '@angular/core';
import { Router} from '@angular/router';
import {Collection} from '../collection';
import { SnackbarService} from '../snackbar.service';
import * as wilddog from 'wilddog';

@Component({
  selector: 'app-group-info-editor',
  templateUrl: './group-info-editor.component.html',
  styleUrls: ['./group-info-editor.component.css']
})
export class GroupInfoEditorComponent implements OnDestroy {
  collection: Collection = new Collection();
  ref: any = null;
  _key: string;
  @Input() isOwner: boolean = false;

  constructor(public snackbarService: SnackbarService, public router: Router) {}

  @Input()
  get key(): string {
    return this._key;
  }
  set key(value: string) {
    this._key = value;
    this.ref = wilddog.sync().ref('groups').child(this._key).child('info');
    this.ref.on('value', (snapshot) => {
      if (snapshot.val()) {
        this.collection = new Collection(snapshot.val());
      }
    });
  }

  ngOnDestroy() {
    this.ref.off();
  }

  submit() {
    if (this.isOwner && this.ref) {
      this.ref.update(this.collection)
        .then((_) => {
          this.snackbarService.info('更新成功');
        })
        .catch((err) => this.snackbarService.error(err));
    }
  }

  delete() {
    if (this.isOwner && this.ref) {
      wilddog.sync().ref('groups').child(this._key).remove()
        .then((_) => {
          this.snackbarService.info('更新成功');
          this.router.navigateByUrl('/groups');
        })
        .catch((err) => this.snackbarService.error(err));
    }
  }

}
