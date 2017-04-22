import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-black-page',
  templateUrl: './black-page.component.html',
  styleUrls: ['./black-page.component.css']
})
export class BlackPageComponent implements OnInit {
  blackKey: string;

  constructor(private _route: ActivatedRoute) {
    _route.params.subscribe(p => {
      this.blackKey = p['id'];
    });
  }

  ngOnInit() {
  }

}
