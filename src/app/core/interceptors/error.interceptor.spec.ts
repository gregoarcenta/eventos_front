import { AuthService } from "../services/api/auth.service";

import { TestBed } from "@angular/core/testing";

import { ErrorInterceptor } from "./error.interceptor";
import { HttpHandler, HttpRequest } from "@angular/common/http";
import { throwError } from "rxjs";
import Swal from "sweetalert2";

describe("ExampleInterceptor", () => {
  let interceptor: ErrorInterceptor;

  const authServiceMock = {
    logout: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ErrorInterceptor,
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    interceptor = TestBed.inject(ErrorInterceptor);
  });

  beforeEach(() => {
    jest.clearAllMocks(); // Esto restablecerá todas las simulaciones entre las pruebas
  });

  it("should be created", () => {
    expect(interceptor).toBeTruthy();
  });

  it("Debe de cerrar sesion cuando la respuesta del token sea 'jwt expired'", (done) => {
    // Mock dependencies
    const request = {} as HttpRequest<any>;
    const next: HttpHandler = {
      handle: jest.fn(),
    };

    const errorResponse = {
      status: 500,
      message: "jwt expired",
    };

    const handleSpy = jest
      .spyOn(next, "handle")
      .mockReturnValue(throwError(() => ({ error: errorResponse })));

    const sweetAlertSpy = jest.spyOn(Swal, "fire");

    // Call intercept method
    interceptor.intercept(request, next).subscribe({
      error: (error) => {
        // Asserts
        expect(handleSpy).toHaveBeenCalledWith(request);
        expect(authServiceMock.logout).toHaveBeenCalled();
        expect(sweetAlertSpy).toHaveBeenCalledWith({
          title: "Sesión expirada",
          text: "Tu sesión expiró, inicia sesión nuevamente",
          icon: "info",
        });
        done();
      },
    });
  });

  it("Debe de cerrar sesion cuando la respuesta del token sea 'invalid token'", (done) => {
    // Mock dependencies
    const request = {} as HttpRequest<any>;
    const next: HttpHandler = {
      handle: jest.fn(),
    };

    const errorResponse = {
      status: 500,
      message: "invalid token",
    };

    const handleSpy = jest
      .spyOn(next, "handle")
      .mockReturnValue(throwError(() => ({ error: errorResponse })));

    const sweetAlertSpy = jest.spyOn(Swal, "fire");

    // Call intercept method
    interceptor.intercept(request, next).subscribe({
      error: (error) => {
        // Asserts
        expect(handleSpy).toHaveBeenCalledWith(request);
        expect(authServiceMock.logout).toHaveBeenCalled();
        expect(sweetAlertSpy).toHaveBeenCalledWith({
          title: "Sesión expirada",
          text: "Tu sesión expiró, inicia sesión nuevamente",
          icon: "info",
        });
        done();
      },
    });
  });

  it("Debe de cerrar sesion cuando la respuesta del token sea 'invalid signature'", (done) => {
    // Mock dependencies
    const request = {} as HttpRequest<any>;
    const next: HttpHandler = {
      handle: jest.fn(),
    };

    const errorResponse = {
      status: 500,
      message: "invalid signature",
    };

    const handleSpy = jest
      .spyOn(next, "handle")
      .mockReturnValue(throwError(() => ({ error: errorResponse })));

    const sweetAlertSpy = jest.spyOn(Swal, "fire");

    // Call intercept method
    interceptor.intercept(request, next).subscribe({
      error: (error) => {
        // Asserts
        expect(handleSpy).toHaveBeenCalledWith(request);
        expect(authServiceMock.logout).toHaveBeenCalled();
        expect(sweetAlertSpy).toHaveBeenCalledWith({
          title: "Sesión expirada",
          text: "Tu sesión expiró, inicia sesión nuevamente",
          icon: "info",
        });
        done();
      },
    });
  });

  it("Debe llamar a sweetAlert con mensaje de error si el status es 400", (done) => {
    // Mock dependencies
    const request = {} as HttpRequest<any>;
    const next: HttpHandler = {
      handle: jest.fn(),
    };

    const errorResponse = {
      status: 400,
      message: "User not valid for access at this site",
    };

    const handleSpy = jest
      .spyOn(next, "handle")
      .mockReturnValue(throwError(() => ({ error: errorResponse })));

    const sweetAlertSpy = jest.spyOn(Swal, "fire");

    // Call intercept method
    interceptor.intercept(request, next).subscribe({
      error: (error) => {
        // Asserts
        expect(handleSpy).toHaveBeenCalledWith(request);
        expect(authServiceMock.logout).not.toHaveBeenCalled();
        expect(sweetAlertSpy).toHaveBeenCalledWith(
          "¡Lo sentimos!",
          errorResponse.message,
          "error"
        );
        done();
      },
    });
  });

  it("Debe llamar a sweetAlert con mensaje de error si el status es 500", (done) => {
    // Mock dependencies
    const request = {} as HttpRequest<any>;
    const next: HttpHandler = {
      handle: jest.fn(),
    };

    const errorResponse = {
      status: 500,
      message: "Error del servidor",
    };

    const handleSpy = jest
      .spyOn(next, "handle")
      .mockReturnValue(throwError(() => ({ error: errorResponse })));

    const sweetAlertSpy = jest.spyOn(Swal, "fire");

    // Call intercept method
    interceptor.intercept(request, next).subscribe({
      error: (error) => {
        // Asserts
        expect(handleSpy).toHaveBeenCalledWith(request);
        expect(authServiceMock.logout).not.toHaveBeenCalled();
        expect(sweetAlertSpy).toHaveBeenCalledWith(
          "¡Lo sentimos!",
          "Ha ocurrido un error inesperado en el sistema, vuelva a intentarlo mas tarde",
          "error"
        );
        done();
      },
    });
  });
});
