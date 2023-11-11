import { EventService } from "../../../../../core/services/events.service";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";

@Component({
  selector: "app-event",
  templateUrl: "./create-event-admin.component.html",
  styleUrls: ["./create-event-admin.component.scss"],
})
export class CreateEventAdminComponent implements OnInit {
  public isAdmin: boolean = true;

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {}

  createEvent(event: any) {
    this.eventService.createEvent(event).subscribe((response) => {
      Swal.fire("¡Listo!", response.message, "success").then((_) => {
        this.router.navigate(["/administrador/eventos"]);
      });
    });
  }
}
