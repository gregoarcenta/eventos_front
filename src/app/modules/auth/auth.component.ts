import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent implements OnInit {
  public authForm = this.fb.group({
    user: ["", [Validators.required]],
    password: ["", [Validators.required]],
  });

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {}
  login() {
    console.log("enviando... ", this.authForm.value);
  }
}
