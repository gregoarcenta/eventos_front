import { IEvent, TypeEvents } from "../../../../../core/interfaces/Eventgfds";

import { EventStore } from "../../../../../core/services/store/event.store";
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Swiper } from "swiper";
import { Subscription } from "rxjs";

@Component({
  selector: "app-card-features-upcoming",
  templateUrl: "./card-features-upcoming.component.html",
  styleUrls: ["./card-features-upcoming.component.scss"],
})
export class CardFeaturesUpcomingComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() typeEvent!: TypeEvents;
  @ViewChild("swiper") swiperRef:
    | ElementRef<HTMLElement & { swiper?: Swiper } & { initialize: () => void }>
    | undefined;
  private swiper?: Swiper;

  public eventSubscription?: Subscription;

  public events: IEvent[] = [];

  constructor(private eventStore: EventStore) {}
  ngOnDestroy(): void {
    this.eventSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    if (this.typeEvent === TypeEvents.Feature) {
      this.eventSubscription = this.eventStore.featured$.subscribe((events) => {
        this.events = events;
      });
    } else {
      this.eventSubscription = this.eventStore.upcoming$.subscribe((events) => {
        this.events = events;
      });
    }
  }

  ngAfterViewInit(): void {
    const swiperEl = Object.assign(this.swiperRef!.nativeElement, {
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: {
        clickable: true,
        dynamicBullets: true,
      },
      autoplay: {
        delay: 4000,
        disableOnInteraction: true,
      },
      breakpoints: {
        1200: {
          slidesPerView: 4,
          spaceBetween: 15,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 15,
        },
        576: {
          slidesPerView: 2,
          spaceBetween: 15,
        },
      },
    });
    swiperEl.initialize();

    this.swiper = this.swiperRef!.nativeElement.swiper;
  }
}
