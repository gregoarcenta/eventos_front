import { User } from "../../interfaces/user";
import { environment } from "../../../../environments/environment";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthService } from "./auth.service";
import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

describe("AuthService", () => {
  const url: string = environment.url;
  let httpMock: HttpTestingController;
  let service: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService],
    });
    router = TestBed.inject(Router);
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    jest.clearAllMocks();
    localStorage.clear();
  });

  it("Debe de loguearse correctamente y guardar el usuario y el token", (done) => {
    const loginData = {
      username: "testuser",
      password: "testpassword",
    };
    const dummyResponse = {
      data: {
        user: {
          id: 1,
          name: "John",
          surname: "Doe",
          username: "johndoe",
          email: "johndoe@example.com",
          img: null,
          age: null,
          phone: null,
          num_document: null,
          document_id: null,
          business_name: null,
        },
        jwt: "TOKEN",
      },
    };

    // Llama al método de inicio de sesión
    service.login(loginData).subscribe((response) => {
      expect(response).toEqual(dummyResponse);
      expect(service.getAuthUser).toBe(dummyResponse.data.user);
      expect(localStorage.getItem("token")).toEqual(dummyResponse.data.jwt);
      done();
    });
    const req = httpMock.expectOne(`${url}/login`);
    expect(req.request.method).toBe("POST");
    req.flush(dummyResponse);

    httpMock.verify();
  });

  it("Debe de retornar true(Si autenticado) si existe el tanto el jwt como el usuario", (done) => {
    localStorage.setItem("token", "TOKEN");
    service.setAuthUser = {} as User;
    service.isAuthenticate().subscribe((response) => {
      expect(response).toBe(true);
      done();
    });

    httpMock.expectNone(`${url}/login/renew`);
    httpMock.verify();
  });

  it("Debe retornar false(No autenticado) si no existe el jwt", (done) => {
    service.isAuthenticate().subscribe((response) => {
      expect(response).toBe(false);
      done();
    });
    httpMock.expectNone(`${url}/login/renew`);
    httpMock.verify();
  });

  it("Debe obtener el usuario si existe el token pero no el usuario", (done) => {
    const dummyResponse = {
      data: {
        user: {
          id: 1,
          name: "John",
          surname: "Doe",
          username: "johndoe",
          email: "johndoe@example.com",
          img: null,
          age: null,
          phone: null,
          num_document: null,
          document_id: null,
          business_name: null,
        },
        jwt: "NUEVO_TOKEN",
      },
    };
    localStorage.setItem("token", "TOKEN");
    service.isAuthenticate().subscribe((response) => {
      expect(response).toBe(true);
      expect(service.getAuthUser).toEqual(dummyResponse.data.user);
      expect(localStorage.getItem("token")).toEqual(dummyResponse.data.jwt);
      done();
    });
    const req = httpMock.expectOne(`${url}/login/renew`);
    req.flush(dummyResponse);
    httpMock.verify();
  });

  it("Debe retornar error al llamar el servicio", (done) => {
    localStorage.setItem("token", "TOKEN");
    service.isAuthenticate().subscribe((response) => {
      expect(response).toBe(false);
      done();
    });
    const req = httpMock.expectOne(`${url}/login/renew`);
    req.flush("Error del servidor", {
      status: 500,
      statusText: "Internal server error",
    });
    httpMock.verify();
  });

  it("Debe mostrar sweetalert para preguntar si cerrar sesion", async () => {
    const fireSpy = jest.spyOn(Swal, "fire");
    fireSpy.mockImplementation(
      () => Promise.resolve({ isConfirmed: true }) as any
    );

    const logoutSpy = jest.spyOn(service, "logout");
    logoutSpy.mockImplementation(() => {});

    await service.onLogout();

    expect(fireSpy).toHaveBeenCalledWith({
      title: "¿Estás seguro que deseas cerrar sesión?",
      icon: "warning",
      confirmButtonText: "Si, cerrar sesión",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#7460ee",
    });
    expect(logoutSpy).toHaveBeenCalled();
  });

  it("Debe eliminar el token y usuario al hacer cerrar sesion", () => {
    localStorage.setItem("token", "TOKEN");
    service.setAuthUser = {} as User;

    router.navigate = jest.fn();

    service.logout();

    expect(localStorage.getItem("token")).toBeNull();
    expect(service.getAuthUser).toBeUndefined();
  });

    it("Debe redirigir al login al cerrar sesion si esta en 'admin.eventosec.com'", () => {
    environment.domain = "admin.eventosec.com";

    router.navigate = jest.fn();
    const navigateSpy = jest.spyOn(router, "navigate")

    service.logout();

    expect(navigateSpy).toHaveBeenCalledWith(["/administrador/login"]);
  });

    it("Debe redirigir al login al cerrar sesion si esta en 'eventosec.com'", () => {
    environment.domain = "eventosec.com";

    router.navigate = jest.fn();
    const navigateSpy = jest.spyOn(router, "navigate");

    service.logout();

    expect(navigateSpy).toHaveBeenCalledWith(["/login"]);
  });
});
