import { environment } from "./../../../../../../environments/environment";
import { Event } from "./../../../../../interfaces/event";
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Swiper } from "swiper";

@Component({
  selector: "app-card-features-upcoming",
  templateUrl: "./card-features-upcoming.component.html",
  styleUrls: ["./card-features-upcoming.component.scss"],
})
export class CardFeaturesUpcomingComponent implements OnInit, AfterViewInit {
  @Input() dataEvents: Event[] = [];
  @ViewChild("swiper") swiperRef:
    | ElementRef<HTMLElement & { swiper?: Swiper } & { initialize: () => void }>
    | undefined;
  private swiper?: Swiper;

  public url = `${environment.url}/upload/eventos`;

  constructor() {}

  ngOnInit(): void {}

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
