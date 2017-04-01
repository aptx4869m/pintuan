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

var config = {
  syncURL: "https://aptx4869.wilddogio.com" //输入节点 URL
};
wilddog.initializeApp(config);

const appRoutes: Routes = [
  { path: '*', component: AppComponent },
  { path: 'group/:id', component: AppComponent },
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule
    RouterModule.forRoot(appRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
