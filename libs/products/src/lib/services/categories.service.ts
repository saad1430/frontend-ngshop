import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { Icons } from '../models/icons';
import { ConnectionStringService } from '@ecommerce/services';

@Injectable({
	providedIn: 'root',
})
export class CategoriesService {
	constructor(private http: HttpClient, private con: ConnectionStringService) {}
	URL = this.con.API_URL;

	getIcons(): Observable<Icons[]> {
		return this.http.get<Icons[]>(`${this.URL}icon`);
	}

	getCategories(): Observable<Category[]> {
		return this.http.get<Category[]>(`${this.URL}category`);
	}

	getCategory(categoryId: string): Observable<Category> {
		return this.http.get<Category>(`${this.URL}category/${categoryId}`);
	}

	createCategory(category: Category): Observable<Category> {
		return this.http.post<Category>(`${this.URL}category`, category);
	}

	updateCategory(category: Category, categoryId: string): Observable<Category> {
		return this.http.put<Category>(
			`${this.URL}category/${categoryId}`,
			category,
		);
	}

	deleteCategory(categoryId: string): Observable<object> {
		return this.http.delete<object>(`${this.URL}category/${categoryId}`);
	}
}
