import { RestoreAccountService } from "./../../../../../services/restore-account.service";
import { SpinnerService } from "./../../../../../services/spinner.service";
import { environment } from "./../../../../../../environments/environment";
import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-send-mailrestore-account",
  templateUrl: "./send-mailrestore-account.component.html",
  styleUrls: ["./send-mailrestore-account.component.scss"],
})
export class SendMailrestoreAccountComponent implements OnInit {
  public sendEmail: boolean = false;
  public email = new FormControl("", [Validators.email, Validators.required]);
  //todo: diseño menu mobile, diseño esta interfaz mobile, diseño registro

  constructor(
    private restoreAccountService: RestoreAccountService,
    private spinner: SpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  validInput() {
    return this.email.errors && this.email.touched;
  }

  sendMail() {
    if (this.email.invalid) return this.email.markAllAsTouched();

    this.spinner.setActive(true);

    this.restoreAccountService
      .sendMailRestoreAccount(this.email.value!)
      .subscribe({
        next: (response) => {
          this.spinner.setActive(false);
          Swal.fire({
            title: "Listo!",
            text: response.message,
            icon: "success",
            heightAuto: false,
          });
          this.sendEmail = true;
          setTimeout(() => {
            this.router.navigateByUrl("login");
          }, 15000);
        },
        error: ({ error }) => {
          this.spinner.setActive(false);
          if (error.status === 400) {
            Swal.fire({
              title: "Lo sentimos!",
              text: error.message,
              icon: "error",
              heightAuto: false,
            });
          } else if (error.status === 401) {
            Swal.fire({
              title: "Lo sentimos!",
              text: `Ya se a enviado un correo recuperación a ${this.email.value} recientemente`,
              icon: "error",
              heightAuto: false,
            });
          } else {
            Swal.fire({
              title: "Lo sentimos!",
              text: environment.msgErrorDefault,
              icon: "error",
              heightAuto: false,
            });
          }
        },
      });
  }
}
