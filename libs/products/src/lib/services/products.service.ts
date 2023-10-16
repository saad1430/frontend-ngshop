import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConnectionStringService } from '@ecommerce/services';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
	providedIn: 'root',
})
export class ProductsService {
	URL = this.con.API_URL;

	constructor(private http: HttpClient, private con: ConnectionStringService) {}

	getProducts(): Observable<Product[]> {
		return this.http.get<Product[]>(`${this.URL}product`);
	}

	getProduct(ProductId: string): Observable<Product> {
		return this.http.get<Product>(`${this.URL}product/one/${ProductId}`);
	}

	createProduct(Product: Product): Observable<Product> {
		return this.http.post<Product>(`${this.URL}product/create`, Product);
	}

	updateProduct(Product: Product, ProductId: string): Observable<Product> {
		return this.http.put<Product>(
			`${this.URL}product/update/${ProductId}`,
			Product,
		);
	}

	deleteProduct(ProductId: string): Observable<object> {
		return this.http.delete<object>(`${this.URL}product/delete/${ProductId}`);
	}
}
