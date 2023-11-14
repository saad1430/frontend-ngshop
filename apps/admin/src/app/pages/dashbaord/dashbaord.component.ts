import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdersService } from '@ecommerce/orders';
import { CategoriesService, ProductsService } from '@ecommerce/products';
import { UsersService } from '@ecommerce/users';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'admin-dashbaord',
	templateUrl: './dashbaord.component.html',
})
export class DashbaordComponent implements OnInit, OnDestroy {
	users: number;
	admins: number;
	products: number;
	categories: number;
	orders: number;
	sales: number;
	endSub$: Subject<any> = new Subject();

	constructor(
		private user: UsersService,
		private product: ProductsService,
		private cat: CategoriesService,
		private order: OrdersService,
	) {}

	ngOnInit(): void {
		this._takeCounts();
	}

	ngOnDestroy(): void {
		this.endSub$.complete();
	}

	private _takeCounts() {
		this._countUsers();
		this._countAdmins();
		this._countProducts();
		this._countCategories();
		this._countOrders();
		this._countSales();
	}

	private _countUsers() {
		this.user
			.getOnlyUsersCount()
			.pipe(takeUntil(this.endSub$))
			.subscribe((count) => {
				this.users = count;
			});
	}
	private _countAdmins() {
		this.user
			.getOnlyAdminsCount()
			.pipe(takeUntil(this.endSub$))
			.subscribe((count) => {
				this.admins = count;
			});
	}
	private _countProducts() {
		this.product
			.getProductsCount()
			.pipe(takeUntil(this.endSub$))
			.subscribe((count) => {
				this.products = count;
			});
	}
	private _countCategories() {
		this.cat
			.getCategoriesCount()
			.pipe(takeUntil(this.endSub$))
			.subscribe((count) => {
				this.categories = count;
			});
	}
	private _countOrders() {
		this.order
			.getOrdersCount()
			.pipe(takeUntil(this.endSub$))
			.subscribe((count) => {
				this.orders = count;
			});
	}
	private _countSales() {
		this.order
			.getSales()
			.pipe(takeUntil(this.endSub$))
			.subscribe((data) => {
				this.sales = data.totalsales;
			});
	}

	customOptions: OwlOptions = {
		loop: true,
		dots: false,
		navSpeed: 100,
		autoplay: true,
		responsive: {
			0: {
				items: 1,
			},
			400: {
				items: 2,
			},
			740: {
				items: 3,
			},
			940: {
				items: 4,
			},
			1080: {
				items: 6,
			},
		},
	};
}
