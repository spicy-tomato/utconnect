import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { slideUp } from '@utconnect/animations';
import { StringHelper } from '@utconnect/helpers';
import { tap } from 'rxjs';
import { LoginStore } from './login.store';
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiInputPasswordModule,
} from '@taiga-ui/kit';
import { LetModule } from '@ngrx/component';

const NGRX = [LetModule];
const TAIGA_UI = [
  TuiButtonModule,
  TuiErrorModule,
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiInputPasswordModule,
  TuiTextfieldControllerModule,
];

@Component({
  selector: 'auth-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...NGRX, ...TAIGA_UI],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LoginStore],
  animations: [slideUp],
})
export class LoginComponent implements OnInit {
  // INJECT PROPERTIES
  private readonly store = inject(LoginStore);
  private readonly fb = inject(NonNullableFormBuilder);

  // PUBLIC PROPERTIES
  readonly form = this.fb.group({
    userName: ['', Validators.required],
    password: ['', Validators.required],
    // TODO: Remove below
    validator: [''],
  });
  readonly status$ = this.store.status$;

  // LIFECYCLE
  ngOnInit(): void {
    this.handleStatusChange();
  }

  // PUBLIC METHODS
  login(): void {
    if (this.form.valid) {
      const { validator, ...registerForm } = this.form.getRawValue();
      this.store.login({
        ...registerForm,
        password: StringHelper.md5(registerForm.password),
      });
    }
  }

  // PRIVATE METHODS
  private handleStatusChange(): void {
    this.status$
      .pipe(
        tap(status => {
          if (status === 'error') {
            this.form.setErrors({ validator: 'Username or password is wrong' });
          }
        })
      )
      .subscribe();
  }
}
