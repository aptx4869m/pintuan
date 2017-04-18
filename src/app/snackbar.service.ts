import { Injectable } from '@angular/core';
import {MdSnackBar} from '@angular/material';

@Injectable()
export class SnackbarService {

  constructor(public snackbar: MdSnackBar) { }

  info(text: string) {
    console.log(text);
    this.snackbar.open(text, null, {duration: 2000});
  }

  error(err: any) {
    console.log(err);
    this.snackbar.open(`错误: ${err}`, null, {duration: 2000});
  }

}
