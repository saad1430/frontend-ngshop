import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UsersService } from '@ecommerce/users';
import {
	CitiesService,
	ConnectionStringService,
	CountriesService,
	ToastService,
} from '@ecommerce/services';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'admin-user-form',
	templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit, OnDestroy {
	loading = false;
	user!: User;
	form!: FormGroup;
	isSubmitted = false;
	isValid = false;
	editMode = false;
	editingId!: string;
	url = this.con.INIT_URL;
	imageUrl: string;
	formName = 'User';
	countries = [];
	cities = [];
	passwordValidated = false;
	endSub$: Subject<any> = new Subject();

	constructor(
		private fb: FormBuilder,
		private userService: UsersService,
		private toast: ToastService,
		private router: Router,
		private activeLink: ActivatedRoute,
		private con: ConnectionStringService,
		private citiesService: CitiesService,
		private countriesService: CountriesService,
	) {}

	ngOnInit() {
		this._initForm();
	}

	ngOnDestroy(): void {
		this.endSub$.complete();
	}

	get fc() {
		return this.form.controls;
	}

	private _initForm() {
		this.loading = true;
		this._formBuilder();
		this._checkEditMode();
		this._getCountries();
		this.loading = false;
	}

	private _getCountries() {
		this.countries = this.countriesService.countriesList;
	}

	private _getcities(country: string) {
		this.cities = this.citiesService.setCities(country);
	}

	private _formBuilder() {
		this.form = this.fb.group({
			name: [
				'',
				Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(100),
				]),
			],
			email: [
				'',
				Validators.compose([
					Validators.required,
					Validators.email,
					Validators.maxLength(255),
				]),
			],
			password: [
				'',
				Validators.compose([
					Validators.required,
					Validators.minLength(8),
					Validators.maxLength(32),
				]),
			],
			confirmPassword: [
				'',
				Validators.compose([
					Validators.required,
					Validators.minLength(8),
					Validators.maxLength(32),
				]),
			],
			phone: [
				'',
				Validators.compose([
					Validators.required,
					Validators.min(100000000),
					Validators.max(999999999999),
				]),
			],
			isAdmin: [false],
			street: [''],
			apartment: [''],
			city: ['', Validators.required],
			zip: [
				'',
				Validators.compose([Validators.min(1000), Validators.max(99999)]),
			],
			country: ['', Validators.required],
		});
	}

	checkPassword() {
		if (this.fc.password.value && this.fc.confirmPassword.value) {
			this.passwordValidated = this.fc
				? this.fc.password.value === this.fc.confirmPassword.value
				: false;
		}
	}

	private _checkEditMode() {
		this.activeLink.params
			.subscribe((params) => {
				if (params.id) {
					this.editMode = true;
					this.editingId = params.id;
					this.userService.getUser(params.id).subscribe((res) => {
						this.user = res.user;
						if (res.success) {
							this.form.setValue({
								name: this.user.name,
								email: this.user.email,
								phone: this.user.phone,
								isAdmin: this.user.isAdmin,
								street: this.user.street,
								apartment: this.user.apartment,
								city: this.user.city,
								zip: this.user.zip,
								country: this.user.country,
								password: '',
								confirmPassword: '',
							});
							this.fc.password.setValidators([]);
							this.fc.password.updateValueAndValidity();
							this.fc.confirmPassword.setValidators([]);
							this.fc.confirmPassword.updateValueAndValidity();
						}
					});
				}
			})
			.unsubscribe();
	}

	onSubmit() {
		this.isSubmitted = true;
		if (this.form.valid) {
			if (this.fc.password.value == '' && this.fc.confirmPassword.value == '') {
				this.passwordValidated = true;
			}
			if (!this.passwordValidated) {
				this.isValid = false;
				this.toast.showError(
					'Password and Confirm Password are not same',
					'NG Shop',
					true,
				);
				return;
			}
			this.isValid = true;
			const element = document.getElementById('submit-btn');
			if (element) {
				element.innerHTML = `<i class="fa-light fa-spinner fa-spin me-2"></i>${
					this.editMode ? 'Updating' : 'Saving'
				}`;
			}
			const user: User = {
				name: this.fc.name.value,
				email: this.fc.email.value,
				password: this.fc.confirmPassword.value,
				phone: this.fc.phone.value,
				isAdmin: this.fc.isAdmin.value,
				street: this.fc.street.value,
				apartment: this.fc.apartment.value,
				city: this.fc.city.value,
				zip: this.fc.zip.value,
				country: this.fc.country.value,
			};
			if (this.editMode) {
				this._update(user);
			} else {
				this._add(user);
			}
		} else {
			this.toast.showError('Please fill all the required fields');
			return;
		}
	}

	private _add(user: User) {
		this.userService
			.createUser(user)
			.pipe(takeUntil(this.endSub$))
			.subscribe({
				next: (res) => {
					if (!res.success) {
						this.toast.showError(res.error);
						return;
					}
					this.toast.showSuccess(`user added successfully`);
					this.router.navigateByUrl('/users');
				},
				error: (error) => {
					this.toast.showError("user couldn't be added");
					this.toast.showError(error, 'Error:', true);
					this._cantSend();
					console.warn(error);
				},
			});
	}

	private _update(user: User) {
		this.userService
			.updateUser(user, this.editingId)
			.pipe(takeUntil(this.endSub$))
			.subscribe({
				next: () => {
					this.toast.showSuccess(`User updated successfully`);
					this.router.navigateByUrl('/users');
				},
				error: (error) => {
					this.toast.showError("User couldn't be updated");
					this.toast.showError(error, 'Error:', true);
					this._cantSend();
					console.warn(error);
				},
			});
	}

	private _cantSend() {
		this.isValid = false;
		const element = document.getElementById('submit-btn');
		if (element) {
			element.innerHTML = `<i class="far fa-save me-2"></i>${
				this.editMode ? 'Update' : 'Save'
			}`;
		}
	}

	onCountrySelect() {
		this._getcities(this.fc.country.value);
	}
}
