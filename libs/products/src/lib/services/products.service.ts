/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConnectionStringService } from '@ecommerce/services';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
	providedIn: 'root',
})
export class ProductsService {
	URL = `${this.con.API_URL}product`;

	constructor(private http: HttpClient, private con: ConnectionStringService) {}

	getProducts(
		first?: number,
		rows?: number,
		sortField?: string,
		sortOrder?: number,
	): Observable<Product[]> {
		return this.http.get<Product[]>(`${this.URL}?first=${first||0}&rows=${rows||10}&sortField=${sortField||'name'}&sortOrder=${sortOrder||1}`);
	}

	getProductsCount(): Observable<number> {
		return this.http.get<number>(`${this.URL}/count`);
	}

	getProduct(ProductId: string): Observable<any> {
		return this.http.get<any>(`${this.URL}/one/${ProductId}`);
	}

	createProduct(Product: FormData): Observable<any> {
		return this.http.post<any>(`${this.URL}/create`, Product);
	}

	updateProduct(Product: FormData, ProductId: string): Observable<any> {
		return this.http.put<any>(`${this.URL}/update/${ProductId}`, Product);
	}

	deleteProduct(ProductId: string): Observable<object> {
		return this.http.delete<object>(`${this.URL}/delete/${ProductId}`);
	}
}
