import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../auth.enum';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { EmailValidation, PasswordValidation } from '../../common/validations';
import { UiService } from '../../common/ui.service';

@Component({
  selector: 'nx-soko-bora-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError = '';
  redirectUrl;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private uiService: UiService,
    private store: Store
  ) {
    route.paramMap.subscribe((params) => (this.redirectUrl = params.get('redirectUrl')));
  }
  ngOnInit() {
    this.buildLoginForm();
  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', EmailValidation],
      password: ['', PasswordValidation],
    });
  }

  login(submittedForm: FormGroup) {
    this.authService
      .login(submittedForm.value.email, submittedForm.value.password)
      .subscribe(
        (authStatus) => {
          if (authStatus.isAuthenticated) {
            this.uiService.showToast(`Welcome! Role: ${authStatus.userRole}`);
            this.router.navigate([
              this.redirectUrl || this.homeRoutePerRole(authStatus.userRole),
            ]);
          }
        },
        (error) => (this.loginError = error)
      );
  }

  homeRoutePerRole(role: Role) {
    switch (role) {
      case Role.Cashier:
        return '/pos';
      case Role.Clerk:
        return '/inventory';
      case Role.Manager:
        return '/manager';
      default:
        return '/user/profile';
    }
  }
}
