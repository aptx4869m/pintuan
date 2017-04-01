import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {MaterialModule} from '@angular/material';
import * as wilddog from 'wilddog';

import {UserService} from './user.service';
import {GoodsService} from './goods.service';
import { AppComponent } from './app.component';

var config = {
  syncURL: "https://<appId>.wilddogio.com" //输入节点 URL
};
wilddog.initializeApp(config);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule
  ],
  providers: [ UserService, GoodsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
