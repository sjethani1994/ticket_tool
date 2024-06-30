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
  // Form group for the login form
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize the login form with email and password fields
    this.loginForm = this.fb.group({
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // Injecting necessary services
  private masterService: MasterService = inject(MasterService);
  private router = inject(Router);

  // Method called on form submission
  onLogin() {
    // If the form is invalid, mark all fields as touched to show validation errors
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Extract credentials from the form
    const credentials: AuthCredentials = {
      emailId: this.loginForm.value.emailId,
      password: this.loginForm.value.password,
    };

    // Attempt to login using the master service
    this.masterService.login(credentials).subscribe({
      next: (res) => {
        // On successful login, store user information and navigate to dashboard
        if (res.result) {
          localStorage.setItem('ticketUser', JSON.stringify(res));
          this.router.navigateByUrl('dashboard');
        } else {
          // Show an alert with the error message if login fails
          alert(res.message);
        }
      },
      error: (err) => {
        // Log any error that occurs during the login process
        console.error('Login failed', err);
      },
      complete: () => {
        // Log a message indicating that the login request is complete
        console.info('Login request complete');
      },
    });
  }
}
