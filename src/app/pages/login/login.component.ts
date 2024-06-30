import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthCredentials } from '../../models/login.model';
import { MasterService } from '../../services/master.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  private masterService: MasterService = inject(MasterService); // In context
  private router = inject(Router);
  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    console.log(this.loginForm.value);
    console.log(this.loginForm.valid);
    const credentials: AuthCredentials = {
      emailId: this.loginForm.value.emailId,
      password: this.loginForm.value.password,
    };

    this.masterService.login(credentials).subscribe({
      next: (res) => {
        if (res.result) {
          localStorage.setItem('ticketUser', JSON.stringify(res));
          this.router.navigateByUrl('dashboard');
        } else {
          alert(res.message);
        }
      },
      error: (err) => {
        console.error('Login failed', err);
      },
      complete: () => {
        console.info('Login request complete');
      },
    });
  }
}
