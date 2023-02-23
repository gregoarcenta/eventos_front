import { RegisterService } from "./../../../../../services/register.service";
import { SpinnerService } from "./../../../../../services/spinner.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-verify-register",
  templateUrl: "./verify-register.component.html",
  styleUrls: ["./verify-register.component.scss"],
})
export class VerifyRegisterComponent implements OnInit {
  constructor(
    private registerService: RegisterService,
    private spinner: SpinnerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get("token") || "";
    if (!token) {
      this.router.navigateByUrl("/");
      return;
    }
    this.spinner.setActive(true);
    this.registerService.verifyRegister(token).subscribe({
      next: (response) => {
        this.spinner.setActive(false);
        Swal.fire({
          title: "Listo!",
          text: response.message,
          icon: "success",
        });
        localStorage.setItem("token", response.data.token);
        this.router.navigateByUrl("eventos");
      },
      error: (_) => this.router.navigateByUrl("/")
    });
  }
}
