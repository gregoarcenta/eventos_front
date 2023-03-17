import { getMimeFile, urlToFile } from "./../../../utils/convertImage";
import { SpinnerService } from "./../../../services/spinner.service";
import { UserService } from "./../../../services/user.service";
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

  get getImageProfile() {
    return this.authUser?.img || "assets/images/default-image-profile.png";
  }

  constructor(
    private imageCompress: NgxImageCompressService,
    private authService: AuthService,
    private spinner: SpinnerService,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  compressFile() {
    this.imageCompress.uploadFile().then(({ image, orientation }) => {
      this.imageCompress
        .compressFile(image, orientation, 50, 50, 200, 200)
        .then(this.isValidPixelsImage)
        .then((result) => {
          if (result.valid) {
            this.uploadImageProfile(result.compressedImage);
          } else {
            Swal.fire(
              "¡Lo sentimos!",
              "El tamaño de la imagen no es el correcto, trata de que la imagen sea cuadrada",
              "info"
            );
          }
        });
    });
  }

  isValidPixelsImage(compressedImage: string) {
    return new Promise<any>((resolve, reject) => {
      const mime = getMimeFile(compressedImage);
      urlToFile(compressedImage, "image", mime).then((imgFile) => {
        const _URL = window.URL || window.webkitURL;
        const img = new Image();
        img.src = _URL.createObjectURL(imgFile);
        img.onload = function () {
          var width = img.width;
          var height = img.height;
          if (Number(width) >= 200 && Number(height) >= 200) {
            resolve({ compressedImage, valid: true });
          } else {
            resolve({ valid: false });
          }
        };
      });
    });
  }

  uploadImageProfile(compressedImage: string) {
    this.spinner.setActive(true);
    this.userService.updateImgProfileUser(compressedImage).subscribe({
      next: (response) => {
        this.spinner.setActive(false);
        this.authService.setAuthUser = response.data;
      },
      error: (_) => {},
    });
  }

  logout() {
    this.authService.onLogout();
  }
}
