import { Component, OnInit } from '@angular/core';
import {AdminService} from '../admin.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  get isAdmin() { return this.adminService.isAdmin; }

  constructor(public adminService: AdminService) {
  }

  ngOnInit() {
  }

}
