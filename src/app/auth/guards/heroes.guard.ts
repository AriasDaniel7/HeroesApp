import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from "@angular/router";
import { Observable, tap } from "rxjs";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";

const checkAuthStatus = (): Observable<boolean> => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  return authService.checkAuthentication()
    .pipe(
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          router.navigate(['./auth/login']);
        }
      })
    )
}

export const canActivateGuardHeroes: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  return checkAuthStatus();
}

export const canMatchGuardHeroes: CanMatchFn = (route: Route, segments: UrlSegment[]): Observable<boolean> => {
  return checkAuthStatus();
}



