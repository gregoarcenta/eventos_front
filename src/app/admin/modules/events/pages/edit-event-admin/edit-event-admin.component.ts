import { EventService } from './../../../../../core/services/api/event.service';
import { EditEventComponent } from './../../../../../shared/components/events/edit-event/edit-event.component';
import { EventFormStore } from "../../../../../core/services/store/event-form.store";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IEvent } from "app/core/interfaces/event";
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
  public event!: IEvent;

  constructor(
    private eventForm: EventFormStore,
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
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
        this.eventForm.setGeneralDataOriginal();
        this.editEventChild.changesMade = false
      });
  }
  updateDataPlaceEvent(event: any) {
    this.eventService
      .updateDataPlaceEvent(event, this.eventId!)
      .subscribe((response) => {
        Swal.fire("¡Listo!", response.message, "success");
        this.eventForm.setPlaceDataOriginal();
        this.editEventChild.changesMade = false
      });
  }
  updateDataLocalitiesEvent(event: any) {
    this.eventService
      .updateDataLocalitiesEvent(event, this.eventId!)
      .subscribe((response) => {
        Swal.fire("¡Listo!", response.message, "success");
        this.eventForm.setLocalitiesDataForm(response.data)
        this.eventForm.setLocalitiesDataOriginal();
        this.editEventChild.changesMade = false
      });
  }
}
