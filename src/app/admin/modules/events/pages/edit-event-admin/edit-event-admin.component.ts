import { SpinnerService } from "./../../../../../services/spinner.service";
import { Event } from "./../../../../../interfaces/event";
import { EventService } from "./../../../../../services/events.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-edit-event-admin",
  templateUrl: "./edit-event-admin.component.html",
  styleUrls: ["./edit-event-admin.component.scss"],
})
export class EditEventAdminComponent implements OnInit {
  public isAdmin: boolean = true;
  public eventId!: number;
  public event!: Event;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private spinner: SpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.eventId = params["id"];
      if (this.eventId) return this.getEvent(params["id"]);

      this.router.navigateByUrl("/");
    });
  }

  getEvent(eventId: number) {
    this.spinner.setActive(true);
    this.eventService.getEventById(eventId).subscribe({
      next: (response) => {
        this.event = response.data;
        this.spinner.setActive(false);
      },
      error: (error) => {
        this.spinner.setActive(false);
        this.router.navigateByUrl("/");
      },
    });
  }

  updateDataGeneralEvent(event: any) {
    this.spinner.setActive(true);
    this.eventService
      .updateEvent(event, this.eventId!)
      .subscribe((response) => {
        this.spinner.setActive(false);
        Swal.fire("¡Listo!", response.message, "success").then((_) => {
          this.router.navigate(["/administrador/eventos"]);
        });
      });
  }
  updateDataPlaceEvent(event: any) {
    this.spinner.setActive(true);
    this.eventService
      .updateEvent(event, this.eventId!)
      .subscribe((response) => {
        this.spinner.setActive(false);
        Swal.fire("¡Listo!", response.message, "success").then((_) => {
          this.router.navigate(["/administrador/eventos"]);
        });
      });
  }
  updateDataLocalitiesEvent(event: any) {
    this.spinner.setActive(true);
    this.eventService
      .updateEvent(event, this.eventId!)
      .subscribe((response) => {
        this.spinner.setActive(false);
        Swal.fire("¡Listo!", response.message, "success").then((_) => {
          this.router.navigate(["/administrador/eventos"]);
        });
      });
  }
}
