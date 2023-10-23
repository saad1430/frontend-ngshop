/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConnectionStringService } from '@ecommerce/services';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
	providedIn: 'root',
})
export class UsersService {
	URL = `${this.con.API_URL}user`;

	constructor(private http: HttpClient, private con: ConnectionStringService) {}

	getUsers(
		first?: number,
		rows?: number,
		sortField?: string,
		sortOrder?: number,
	): Observable<User[]> {
		return this.http.get<User[]>(
			`${this.URL}?first=${first || 0}&rows=${rows || 10}&sortField=${
				sortField || 'name'
			}&sortOrder=${sortOrder || 1}`,
		);
	}

	getUsersCount(): Observable<number> {
		return this.http.get<number>(`${this.URL}/count`);
	}

	getUser(UserId: string): Observable<any> {
		return this.http.get<any>(`${this.URL}/one/${UserId}`);
	}

	createUser(User: FormData): Observable<any> {
		return this.http.post<any>(`${this.URL}/create`, User);
	}

	updateUser(User: FormData, UserId: string): Observable<any> {
		return this.http.put<any>(`${this.URL}/update/${UserId}`, User);
	}

	deleteUser(UserId: string): Observable<object> {
		return this.http.delete<object>(`${this.URL}/delete/${UserId}`);
	}

	toggleUserAdmin(UserId: string, User: string): Observable<any> {
		return this.http.put<any>(`${this.URL}/toggle/${UserId}`, User);
	}
}
