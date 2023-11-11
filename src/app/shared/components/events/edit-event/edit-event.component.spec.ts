import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditEventComponent } from "./edit-event.component";

describe("EditEventComponent", () => {
  let component: EditEventComponent;
  let fixture: ComponentFixture<EditEventComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditEventComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditEventComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
