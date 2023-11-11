import { EditEventComponent } from './../../../../../shared/components/events/edit-event/edit-event.component';
import { EventFormService } from "../../../../../core/services/event-form.service";
import { SpinnerService } from "../../../../../core/services/spinner.service";
import { Event } from "../../../../../core/interfaces/event";
import { EventService } from "../../../../../core/services/events.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-edit-event-admin",
  templateUrl: "./edit-event-admin.component.html",
  styleUrls: ["./edit-event-admin.component.scss"],
})
export class EditEventAdminComponent implements OnInit {
  @ViewChild(EditEventComponent) editEventChild!: EditEventComponent;
  public isAdmin: boolean = true;
  public eventId!: number;
  public event!: Event;

  constructor(
    private eventFormService: EventFormService,
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    public spinner: SpinnerService,
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
    this.eventService.getEventById(eventId).subscribe({
      next: (response) => {
        this.event = response.data;
      },
      error: (error) => {
        this.router.navigateByUrl("/");
      },
    });
  }

  updateDataGeneralEvent(event: any) {
    this.eventService
      .updateDataGeneralEvent(event, this.eventId!)
      .subscribe((response) => {
        Swal.fire("¡Listo!", response.message, "success");
        this.eventFormService.setGeneralDataOriginal();
        this.editEventChild.changesMade = false
      });
  }
  updateDataPlaceEvent(event: any) {
    this.eventService
      .updateDataPlaceEvent(event, this.eventId!)
      .subscribe((response) => {
        Swal.fire("¡Listo!", response.message, "success");
        this.eventFormService.setPlaceDataOriginal();
        this.editEventChild.changesMade = false
      });
  }
  updateDataLocalitiesEvent(event: any) {
    this.eventService
      .updateDataLocalitiesEvent(event, this.eventId!)
      .subscribe((response) => {
        Swal.fire("¡Listo!", response.message, "success");
        this.eventFormService.setLocalitiesDataForm(response.data)
        this.eventFormService.setLocalitiesDataOriginal();
        this.editEventChild.changesMade = false
      });
  }
}
