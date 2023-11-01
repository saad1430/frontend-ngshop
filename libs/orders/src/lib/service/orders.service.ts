/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConnectionStringService } from '@ecommerce/services';
import { Observable } from 'rxjs';
import { Order } from '../model/orders';

@Injectable({
	providedIn: 'root',
})
export class OrdersService {
	URL = `${this.con.API_URL}order`;
	ORDER_STATUS = {
		0: { label: 'Pending', color: 'primary' },
		1: { label: 'Processed', color: 'warning' },
		2: { label: 'Shipped', color: 'info' },
		3: { label: 'Delivered', color: 'success' },
		4: { label: 'Failed', color: 'danger' },
		5: { label: 'Cancelled', color: 'danger' },
		// 6: { label: 'Deleted', color: 'danger' },
	};

	constructor(private http: HttpClient, private con: ConnectionStringService) {}

	getPrivateOrders(
		first?: number,
		rows?: number,
		sortField?: string,
		sortOrder?: number,
	): Observable<any> {
		return this.http.get<any>(
			`${this.URL}/private/all?first=${first || 0}&rows=${
				rows || 10
			}&sortField=${sortField || 'name'}&sortOrder=${sortOrder || 1}`,
		);
	}

	getOrdersCount(): Observable<number> {
		return this.http.get<number>(`${this.URL}/private/count`);
	}

	getOrder(OrderId: string): Observable<Order> {
		return this.http.get<Order>(`${this.URL}/public/one/${OrderId}`);
	}

	createOrder(Order: FormData): Observable<any> {
		return this.http.post<any>(`${this.URL}/create`, Order);
	}

	updateOrder(Order: Order, OrderId: string): Observable<any> {
		return this.http.put<any>(`${this.URL}/private/update/${OrderId}`, Order);
	}

	deleteOrder(OrderId: string): Observable<object> {
		return this.http.delete<object>(`${this.URL}/delete/${OrderId}`);
	}
}
