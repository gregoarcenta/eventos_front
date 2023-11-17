import { getMimeFile, urlToFile } from "../../../shared/utils/convertImage";
import { UserService } from "../../../core/services/api/user.service";
import { AuthService } from "../../../core/services/api/auth.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgxImageCompressService } from "ngx-image-compress";
import { ImageCroppedEvent } from "ngx-image-cropper";

@Component({
  selector: "app-cuenta-layout",
  templateUrl: "./cuenta-layout.component.html",
  styleUrls: ["./cuenta-layout.component.scss"],
})
export class CuentaLayoutComponent implements OnInit, OnDestroy {
  public imageBase64?: string;
  public croppedImage?: any;
  public croppedOrientation?: any;

  get authUser() {
    return this.authService.getAuthUser;
  }

  get getImageProfile() {
    return this.authUser?.img || "assets/images/default-image-profile.png";
  }

  constructor(
    private imageCompress: NgxImageCompressService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnDestroy(): void {
    this.cleanData();
  }

  ngOnInit(): void {}

  getImageFile() {
    this.imageCompress.uploadFile().then(({ image, orientation }) => {
      this.imageBase64 = image;
      this.croppedOrientation = orientation;
      document.getElementById("recortImageModal")?.click();
    });
  }

  compressFile() {
    this.imageCompress
      .compressFile(
        this.croppedImage,
        this.croppedOrientation,
        100,
        100,
        200,
        200
      )
      .then((img) => this.uploadImageProfile(img));
    /* .then(this.isValidPixelsImage)
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
      }); */
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
          console.log("W: ", width);
          console.log("H: ", height);

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
    //this.spinner.setActive(true);
    this.userService
      .updateImgProfileUser(compressedImage)
      .subscribe((response) => {
        //this.spinner.setActive(false);
        document.getElementById("cancelButton")?.click();
        this.authService.setAuthUser = response.data;
      });
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  cleanData() {
    this.croppedImage = undefined;
    this.croppedOrientation = undefined;
    this.imageBase64 = undefined;
  }

  logout() {
    this.authService.onLogout();
  }
}
