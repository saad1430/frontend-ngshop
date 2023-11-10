import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
	ConnectionStringService,
	LocalStorageService,
} from '@ecommerce/services';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private URL = `${this.con.API_URL}user`;
	constructor(
		private http: HttpClient,
		private con: ConnectionStringService,
		private ls: LocalStorageService,
		private router: Router,
	) {}

	login(email: string, password: string): Observable<any> {
		return this.http.post<any>(`${this.URL}/login`, { email, password });
	}

	logout() {
		this.ls.removeItem('name');
		this.ls.removeItem('email');
		this.ls.removeItem('token');
		this.router.navigateByUrl('/login');
	}
}
