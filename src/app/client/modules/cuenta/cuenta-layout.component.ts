import { AuthService } from "./../../../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { NgxImageCompressService } from "ngx-image-compress";
import Swal from "sweetalert2";

@Component({
  selector: "app-cuenta-layout",
  templateUrl: "./cuenta-layout.component.html",
  styleUrls: ["./cuenta-layout.component.scss"],
})
export class CuentaLayoutComponent implements OnInit {
  get authUser() {
    return this.authService.getAuthUser;
  }

  constructor(
    private imageCompress: NgxImageCompressService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  compressFile() {
    this.imageCompress.uploadFile().then(({ image, orientation }) => {
      this.imageCompress
        .compressFile(image, orientation, 50, 50)
        .then((compressedImage) => {
          console.log(compressedImage);
        });
    });
  }

  logout() {
    this.authService.onLogout();
  }
}
