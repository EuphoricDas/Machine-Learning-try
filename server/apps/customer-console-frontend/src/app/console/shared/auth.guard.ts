import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthenticationService } from "./services/authentication.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authenticationService.isLoggedIn) {
      // not logged in so redirect to login page with the return url
      this.router.navigate(["/console", "login"], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    // check if route is restricted by role
    // if (route.data.permissions) {
    //   let isValid = false;

    //   if (route.data.any === true) {
    //     isValid = this.authenticationService.hasAnyPermission(route.data.permissions);
    //   } else {
    //     isValid = this.authenticationService.hasAllPermissions(
    //       route.data.permissions
    //     );
    //   }

    //   if (!isValid) {
    //     // role not authorised so redirect to home page
    //     this.router.navigate(["/"]);

    //     return false;
    //   }
    // }

    // authorised so return true
    return true;
  }
}
