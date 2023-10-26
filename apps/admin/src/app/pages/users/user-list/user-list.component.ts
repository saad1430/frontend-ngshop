import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ConnectionStringService, ToastService } from '@ecommerce/services';
import { User, UsersService } from '@ecommerce/users';
import { catchError, throwError } from 'rxjs';

@Component({
	selector: 'admin-user-list',
	templateUrl: './user-list.component.html',
})
export class UserListComponent {
	loading = true;
	user: User[] = [];
	totalUsers: number;
	url = this.con.INIT_URL;
	currentEvent: LazyLoadEvent;
	firstItem = 1;
	rows = 5;
	lastItem = this.rows;
	dataIsLoaded = false;

	constructor(
		private userService: UsersService,
		private toast: ToastService,
		private confirmationService: ConfirmationService,
		private router: Router,
		private con: ConnectionStringService,
	) {}

	deleteUser(id: string) {
		this.confirmationService.confirm({
			message: 'Do you want to delete this User?',
			header: 'Delete User',
			icon: 'far fa-exclamation-triangle',
			acceptButtonStyleClass: 'btn btn-danger me-1',
			rejectButtonStyleClass: 'btn btn-success me-1',
			closeOnEscape: true,
			accept: () => {
				this.proceedDeletion(id);
			},
			reject: () => {
				this.toast.showWarn('User deletion cancelled!');
			},
		});
	}

	private proceedDeletion(id: string) {
		this.userService.deleteUser(id).subscribe({
			next: () => {
				this.toast.showSuccess('User deleted successfully');
				this.loadUsers(this.currentEvent);
			},
			error: (error) => {
				this.toast.showError("User couldn't be deleted");
				console.warn(error);
				this.loadUsers(this.currentEvent);
			},
		});
	}

	toggleUserAdmin(id: string) {
		this.confirmationService.confirm({
			message: 'Do you want to toggle Role of this user?',
			header: 'Toggle Role',
			icon: 'far fa-exclamation-triangle',
			acceptButtonStyleClass: 'btn btn-danger me-1',
			rejectButtonStyleClass: 'btn btn-success me-1',
			closeOnEscape: true,
			accept: () => {
				this.proceedToggling(id);
			},
			reject: () => {
				this.toast.showWarn('Role toggle cancelled!');
			},
		});
	}

	private proceedToggling(id: string) {
		this.userService.toggleUserAdmin(id, id).subscribe({
			next: (res) => {
				this.toast.showSuccess(
					`${res.name} is now a(n) ${res.isAdmin ? 'Admin' : 'User'}`,
				);
				this.loadUsers(this.currentEvent);
			},
			error: (error) => {
				this.toast.showError("${res.name}'s role couldn't be toggled");
				console.warn(error);
				this.loadUsers(this.currentEvent);
			},
		});
	}

	private _getUserCount() {
		this.userService.getUsersCount().subscribe((count) => {
			this.totalUsers = count;
			this.dataIsLoaded = true;
		});
	}

	editUser(id: string) {
		this.router.navigateByUrl(`/users/edit/${id}`);
	}

	loadUsers(event: LazyLoadEvent) {
		this.loading = true;
		const first = event.first ? event.first : 0;
		const rows = event.rows ? event.rows : 999999999;
		const sortField = event.sortField ? event.sortField : 'name';
		const sortOrder = event.sortOrder ? event.sortOrder : 1;
		this.currentEvent = event;
		this._getUserCount();
		setTimeout(() => {
			return this.userService
				.getUsers(first, rows, sortField, sortOrder)
				.pipe(
					catchError(() => {
						this.loading = false;
						this.toast.showError(
							'API server is not responding. Please try again later.',
						);
						return throwError(
							() =>
								new Error(
									'API server is not responding. Please try again later.',
								),
						);
					}),
				)
				.subscribe((user) => {
					this.user = user;
					this.loading = false;
				});
		}, 50);
	}

	ourFirstItem(item: number) {
		this.firstItem = item;
	}

	ourLastItem(item: number) {
		this.lastItem = item;
	}
}
