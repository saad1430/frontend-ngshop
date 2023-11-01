import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConnectionStringService } from '@ecommerce/services';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	URL = `${this.con.API_URL}user`;
	constructor(private http: HttpClient, private con: ConnectionStringService) {}

	login(email: string, password: string): Observable<any> {
		return this.http.post<any>(`${this.URL}/login`, { email, password });
	}
}
