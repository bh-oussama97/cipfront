import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const expectedRole = route.data['expectedRole'];
      const currentUser = this.authService.getLoggedInUser();
      const currentRole = JSON.parse(localStorage.getItem('role'))['roles'];

      // if (currentUser && currentUser['role'] === expectedRole) {
      //   return true;
      // }
      if (currentRole === expectedRole)
      {
        return true;
      }
      // User does not have the expected role, redirect to unauthorized page or login page
      this.router.navigate(['/login']);
      return false;
  }
  
}
