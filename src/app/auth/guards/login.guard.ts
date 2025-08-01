import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from "@angular/router";
import { Observable, map, tap } from "rxjs";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";

const checkAuthStatus = (): Observable<boolean> => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  return authService.checkAuthentication()
    .pipe(
      tap(isAuthenticated => {
        if (isAuthenticated) {
          router.navigate(['./heroes/list']);
        }
      }),
      map(isAuthenticated => !isAuthenticated),
    )
}

export const canActivateGuardLogin: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  return checkAuthStatus();
}

export const canMatchGuardLogin: CanMatchFn = (route: Route, segments: UrlSegment[]): Observable<boolean> => {
  return checkAuthStatus();
}
