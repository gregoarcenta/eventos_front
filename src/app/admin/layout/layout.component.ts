import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  constructor(public router: Router) {}
  public isCollapsed = false;
  public innerWidth: number = 0;
  public defaultSidebar: string = "";
  public showMobileMenu = false;
  public expandLogo = false;
  public sidebartype = "full";

  Logo() {
    this.expandLogo = !this.expandLogo;
  }

  ngOnInit() {
    if (this.router.url === "/") {
      this.router.navigate(["/administrador"]);
    }
    this.defaultSidebar = this.sidebartype;
    this.handleSidebar();
  }

  @HostListener("window:resize", ["$event"])
  onResize() {
    this.handleSidebar();
  }

  handleSidebar() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1170) {
      this.sidebartype = "full";
    } else {
      this.sidebartype = this.defaultSidebar;
    }
  }

  toggleSidebarType() {
    switch (this.sidebartype) {
      case "full":
        this.sidebartype = "mini-sidebar";
        break;

      case "mini-sidebar":
        this.sidebartype = "full";
        break;

      default:
    }
  }

}
