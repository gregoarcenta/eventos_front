import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit, OnDestroy {

  constructor() { }
  ngOnDestroy(): void {
    document.querySelector("body")!.style.overflow = "unset"

  }

  ngOnInit(): void {
    document.querySelector("body")!.style.overflow = "hidden"

  }

}
