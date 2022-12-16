import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivationEnd, Router } from "@angular/router";
import {
  Observable,
  retry,
  interval,
  take,
  map,
  filter,
  Subscription,
} from "rxjs";

@Component({
  selector: "app-tickets",
  templateUrl: "./tickets.component.html",
  styleUrls: ["./tickets.component.scss"],
})
export class TicketsComponent implements OnInit, OnDestroy {
  public intervalSubs$: Subscription;
  constructor(private router: Router) {
    // this.returnObserver()
    //   .pipe(retry(1))
    //   .subscribe({
    //     next: (value) => console.log("Subs: ", value),
    //     error: (error) => console.error(error),
    //   });
    this.intervalSubs$ = this.returnInterval().subscribe({
      next: (value) => {
        console.log("valor: ", value);
      },
    });
  }

  ngOnDestroy(): void {
    this.intervalSubs$.unsubscribe();
  }

  ngOnInit(): void {}

  returnInterval() {
    return interval(500).pipe(
      map((value) => value + 1),
      filter((value) => (value % 2 === 0 ? true : false))
      // take(4)
    );
  }
  returnObserver() {
    return new Observable((observer) => {
      let i = -1;
      const interval = setInterval(() => {
        i++;
        observer.next(i);
        if (i === 2) {
          observer.error("Error en el observer");
        }
        if (i === 5) {
          observer.complete();
          clearInterval(interval);
        }
        if (i === 10) {
          observer.error("Error en el observer");
        }
      }, 1000);
    });
  }
}
