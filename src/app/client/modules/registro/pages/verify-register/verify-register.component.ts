import { RegisterService } from "../../../../../core/services/api/register.service";
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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get("token") || "";
    if (!token) {
      this.router.navigateByUrl("/");
      return;
    }
    this.registerService.verifyRegister(token).subscribe({
      next: (response) => {
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
