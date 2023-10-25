import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { EditEventAdminComponent } from "./edit-event-admin.component";

describe("EditEventAdminComponent", () => {
  let httpMock: HttpTestingController;
  let component: EditEventAdminComponent;
  let fixture: ComponentFixture<EditEventAdminComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditEventAdminComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(EditEventAdminComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
