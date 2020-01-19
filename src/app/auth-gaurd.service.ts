import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class AuthGaurdService {

  constructor(private router: Router, private authService: AuthenticationService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
     if (this.authService.isUserLoggedIn()){
      return true;
     } else
     { this.router.navigate(['login']);
       return false;
    }


  }
}
