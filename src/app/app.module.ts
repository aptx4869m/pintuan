import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {MaterialModule} from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import * as wilddog from 'wilddog';

import {UserService} from './user.service';
import {GoodsService} from './goods.service';
import { AppComponent } from './app.component';
import { GroupEditorComponent, GroupJoinComponent } from './group-editor/group-editor.component';
import { GroupInfoEditorComponent } from './group-info-editor/group-info-editor.component';
import { GroupItemEditorComponent } from './group-item-editor/group-item-editor.component';
import { GroupPeopleEditorComponent } from './group-people-editor/group-people-editor.component';
import { SecondHandComponent } from './second-hand/second-hand.component';

var config = {
  syncURL: "https://aptx4869.wilddogio.com"
};
wilddog.initializeApp(config);

const appRoutes: Routes = [
  { path: '*', component: GroupEditorComponent },
  { path: 'group-edit/:id', component: GroupEditorComponent },
  { path: 'group/:id', component: GroupJoinComponent },
  { path: 'second-hand', component: SecondHandComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    GroupEditorComponent,
    GroupJoinComponent,
    GroupInfoEditorComponent,
    GroupItemEditorComponent,
    GroupPeopleEditorComponent,
    SecondHandComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
