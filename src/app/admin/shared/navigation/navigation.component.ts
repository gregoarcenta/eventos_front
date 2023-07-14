import { environment } from './../../../../environments/environment';
import { AuthService } from "../../../services/auth.service";
import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { ActivationEnd, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { filter, map, Subscription } from "rxjs";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"],
})
export class NavigationComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  public url = `${environment.url}/upload/eventos`;

  public title = "";
  public titleSubs$: Subscription;

  public config: PerfectScrollbarConfigInterface = {};

  public showSearch = false;

  get getImageProfile() {
    return this.getAuthUser?.img || "assets/images/default-image-profile.png";
  }


  get getAuthUser() {
    return this.authService.getAuthUser!;
  }

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private authService: AuthService
  ) {
    this.titleSubs$ = this.router.events
      .pipe(
        filter((event) => event instanceof ActivationEnd),
        filter((event: any) => event.snapshot.firstChild === null),
        map((event: ActivationEnd) => event.snapshot.data)
      )
      .subscribe((value) => {
        this.title = value.title;
      });
  }
  ngOnDestroy(): void {
    this.titleSubs$.unsubscribe();
  }
  ngOnInit(): void {}

  ngAfterViewInit() {}

  public selectedLanguage: any = {
    language: "English",
    code: "en",
    type: "US",
    icon: "us",
  };

  public languages: any[] = [
    {
      language: "English",
      code: "en",
      type: "US",
      icon: "us",
    },
    {
      language: "Español",
      code: "es",
      icon: "es",
    },
    {
      language: "Français",
      code: "fr",
      icon: "fr",
    },
    {
      language: "German",
      code: "de",
      icon: "de",
    },
  ];

  logout() {
    this.authService.onLogout();
  }
}
