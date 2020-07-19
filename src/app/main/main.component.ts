import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit(): void {
    document.body.id = "main";
  }

  ngOnDestroy(): void {
    document.body.id = "";
  }
}
