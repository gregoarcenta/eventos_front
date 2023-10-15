import { AuthService } from "./../../../services/auth.service";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthComponent } from "./auth.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { of, throwError } from "rxjs";
import { Router } from "@angular/router";

describe("AuthComponent", () => {
  let fixture: ComponentFixture<AuthComponent>;
  let authComponent: AuthComponent;
  let router: Router;

  const authServiceMock = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    authComponent = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks()
  });

  it("Debe de existir en el componente", () => {
    expect(authComponent).toBeTruthy();
  });

  it("Debe de redirigir al home si las credenciales son VALIDAS", () => {
    const credentials = {
      username: "test",
      password: "password",
    };
    authComponent.loginForm.setValue(credentials);

    router.navigateByUrl = jest.fn();

    authServiceMock.login.mockReturnValue(of({}));

    // Act
    authComponent.login();

    // Assert
    expect(authComponent.loginForm.invalid).toBe(false);
    expect(authServiceMock.login).toHaveBeenCalledWith(credentials);
    expect(router.navigateByUrl).toHaveBeenCalledWith("/");
  });

  it("No debe de redirigir a ningun lado si las credenciales son INVALIDAS", () => {
    const credentials = { username: "test", password: "invalid-password" };
    authComponent.loginForm.setValue(credentials);

    const navigateByUrlSpy = jest.spyOn(router, "navigateByUrl");

    // Simula una respuesta de error del servicio
    authServiceMock.login.mockReturnValue(
      throwError(() => ({ error: "Invalid credentials" }))
    );

    // Act
    authComponent.login();

    // Assert
    expect(authComponent.loginForm.invalid).toBe(false);
    expect(authServiceMock.login).toHaveBeenCalledWith(credentials);
    expect(navigateByUrlSpy).not.toHaveBeenCalled();
  });

  it('Debe mostrar mensaje de error si el campo "username" NO ES VALIDO', () => {
    // Configura el campo de entrada con un valor no válido (en este caso, un valor vacío)
    authComponent.loginForm.get("username")?.setValue("");

    // Marca el campo como tocado
    authComponent.loginForm.get("username")?.markAsTouched();
    expect(true).toBe(true);

    // Act: Angular debe actualizar la vista después de configurar el campo
    fixture.detectChanges();

    const errorMessage = fixture.nativeElement.querySelector(
      ".form-text.text-danger"
    );
    expect(errorMessage).toBeTruthy();
  });

  it('Debe mostrar mensaje de error si el campo "password" NO ES VALIDO', () => {
    // Configura el campo de entrada con un valor no válido (en este caso, un valor vacío)
    authComponent.loginForm.get("password")?.setValue("");

    // Marca el campo como tocado
    authComponent.loginForm.get("password")?.markAsTouched();

    // Act: Angular debe actualizar la vista después de configurar el campo
    fixture.detectChanges();

    // Assert: Verifica que el mensaje de error esté presente en el HTML
    const errorMessage = fixture.nativeElement.querySelector(
      ".form-text.text-danger"
    );
    expect(errorMessage).toBeTruthy();
  });

  it("Debe de marcar como tocados los campos si presiona el boton y los camnpos estan vacios", () => {
    authComponent.loginForm.setValue({
      username: "",
      password: "",
    });

    const markAllAsTouchedMock = jest.spyOn(authComponent.loginForm, "markAllAsTouched")

    authComponent.login();

    expect(authComponent.loginForm.invalid).toBe(true)
    expect(markAllAsTouchedMock).toHaveBeenCalled();
    expect(authServiceMock.login).not.toHaveBeenCalled()
  });

  it("Debe mostrar y ocultar la password al dar click en el icono de ojo", () => {
    authComponent.toggleShowPassword();
    expect(authComponent.showPassword).toBe(true);
    authComponent.toggleShowPassword();
    expect(authComponent.showPassword).toBe(false);
  });
});
