import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { LocalStorageService, ToastService } from '@ecommerce/services';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(
		private ls: LocalStorageService,
		private router: Router,
		private auth: AuthService,
		private toast: ToastService,
	) {}

	canActivate():| boolean| UrlTree| Observable<boolean | UrlTree>| Promise<boolean | UrlTree> {
		const token = this.ls.getItem('token');
		if (token) {
			const tokenDecode = JSON.parse(atob(token.split('.')[1]));
			const exp = this._tokenExpired(tokenDecode.exp);
			if (!exp) {
				this.ls.setItem('name', tokenDecode.name);
				this.ls.setItem('email', tokenDecode.email);
				if (tokenDecode.isAdmin) {
					return true;
				} else {
					return false;
				}
			} else {
				this.toast.showError('Login session expired! Please login again.');
				this.auth.logout();
				return false;
			}
		} else {
			this.toast.showError('Please login to continue!');
			this.auth.logout();
			return false;
		}
	}

	private _tokenExpired(expiry: number): boolean {
		if (Math.floor(new Date().getTime() / 1000) >= expiry) {
			this.toast.showError('Login session expired! Please login again.');
			this.auth.logout();
		}
		return Math.floor(new Date().getTime() / 1000) >= expiry;
	}
}
