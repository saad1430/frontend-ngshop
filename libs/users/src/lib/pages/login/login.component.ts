import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService, ToastService } from '@ecommerce/services';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'ecommerce-login',
	templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
	loading = false;
	register = false;
	form!: FormGroup;
	isSubmitted = false;
	isValid = false;
	errorMessage?:string;

	constructor(
		private fb: FormBuilder,
		private toast: ToastService,
		private auth: AuthService,
		private ls: LocalStorageService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.loading = true;
		this._formBuilder();
		this.loading = false;
	}

	get fc() {
		return this.form.controls;
	}

	changePage() {
		this.register = !this.register;
	}

	private _formBuilder() {
		this.form = this.fb.group({
			email: [
				'saad@admin.com',
				Validators.compose([
					Validators.required,
					Validators.email,
					Validators.maxLength(255),
				]),
			],
			password: [
				'123456789',
				Validators.compose([
					Validators.required,
					Validators.minLength(8),
					Validators.maxLength(32),
				]),
			],
			remember: [false]
		});
	}

	private _cantSend() {
		this.isValid = false;
		const element = document.getElementById('submit-btn');
		if (element) {
			element.innerHTML = `${
				this.register
					? '<i class="fa-duotone fa-user-plus"></i> Sign up'
					: '<i class="fa-duotone fa-right-to-bracket"></i> Login'
			}`;
		}
	}

	login() {
		this.isSubmitted = true;
		this.errorMessage = '';
		console.log(this.fc)
		this.auth
			.login(this.fc['email'].value, this.fc['password'].value)
			.subscribe({
				next: (res) => {
					if (!res.success) {
						this.toast.showError(res.error);
						return;
					}
					this.toast.showSuccess(`User logged in successfully`);
					console.log(res)
					this.ls.setItem('name',res.name);
					this.ls.setItem('email',res.email);
					this.ls.setItem('token',res.token);
					this.router.navigateByUrl('/dashboard');
				},
				error: (error) => {
					this.toast.showError("user couldn't be logged in");
					this._cantSend();
					if (!error.success) {
						this.errorMessage = error.error.message;
					}
					console.warn(error);
				},
			});
		this._cantSend();
	}

	signup() {
		this.isSubmitted = true;
		this.toast.showSuccess('signup')
		this._cantSend();
	}
}
