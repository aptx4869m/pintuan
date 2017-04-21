import { Component, OnInit, Input } from '@angular/core';
import {BlackNote} from '../black';
import {AdminService} from '../admin.service';
import * as wilddog from 'wilddog';

@Component({
  selector: 'app-black-note-editor',
  templateUrl: './black-note-editor.component.html',
  styleUrls: ['./black-note-editor.component.css']
})
export class BlackNoteEditorComponent implements OnInit {
  notes: BlackNote[];
  _blackKey: string;
  @Input() isEditMode: boolean;
  @Input()
  get blackKey(): string { return this._blackKey; }
  set blackKey(key: string) {
    this._blackKey = key;
    this._fetchNotes();
  }

  constructor(private adminService: AdminService) { }

  ngOnInit() {
  }

  isNoteEditMode(note: BlackNote) {
    return this.isEditMode && (this.adminService.isAdmin || note.owner == this.currentUser);
  }


  get currentUser() {
    return wilddog.auth().currentUser ?
      wilddog.auth().currentUser.uid : null;
  }

  _fetchNotes() {
    wilddog.sync().ref('blacklists').child('details').child(this.blackKey).once('value', (snapshot) => {
      this.notes = [];
      snapshot.forEach((childSnapshot) => {
        let note = childSnapshot.val() as BlackNote;
        this.notes.push(note);
      });
    })
  }

  save() {
    wilddog.sync().ref('blacklists').child('details').child(this.blackKey).set(this.notes);
  }

  addBlackNote() {
    let note = new BlackNote();
    note.owner = this.currentUser;
    this.notes.push(note);
  }

  removeBlackNote(i) {
    this.notes.splice(i, 1);
  }
}
