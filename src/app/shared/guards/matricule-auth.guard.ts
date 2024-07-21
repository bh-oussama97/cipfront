import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const matriculeAuthGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);


  authService.get_login_info();
  if (!authService.isAuthenticated) {
    // Redirect to matricule signin page
   return router.parseUrl('/matricule-signin');
  }

  return true;


};
