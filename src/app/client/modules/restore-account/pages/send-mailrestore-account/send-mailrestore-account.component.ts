import { RestoreAccountService } from "./../../../../../services/restore-account.service";
import { SpinnerService } from "./../../../../../services/spinner.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormControl, Validators } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: "app-send-mailrestore-account",
  templateUrl: "./send-mailrestore-account.component.html",
  styleUrls: ["./send-mailrestore-account.component.scss"],
})
export class SendMailrestoreAccountComponent implements OnInit {
  public sendEmail: boolean = false;
  public email = new FormControl("", [Validators.email, Validators.required]);

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
          });
          this.sendEmail = true;
          setTimeout(() => {
            this.router.navigateByUrl("login");
          }, 15000);
        },
        error: (_) => {},
      });
  }
}
