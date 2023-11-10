import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ConnectionStringService, ToastService } from '@ecommerce/services';
import { Product, ProductsService } from '@ecommerce/products';

@Component({
	selector: 'admin-product-list',
	templateUrl: './product-list.component.html',
})
export class ProductListComponent {
	loading = true;
	products: Product[] = [];
	totalProducts: number;
	url = this.con.INIT_URL;
	currentEvent: LazyLoadEvent;
	firstItem = 1;
	rows = 10;
	lastItem = this.rows;
	dataIsLoaded = false;

	constructor(
		private productService: ProductsService,
		private toast: ToastService,
		private confirmationService: ConfirmationService,
		private router: Router,
		private con: ConnectionStringService,
	) {}

	deleteProduct(id: string) {
		this.confirmationService.confirm({
			message: 'Do you want to delete this Product?',
			header: 'Delete Product',
			icon: 'far fa-exclamation-triangle',
			acceptButtonStyleClass: 'btn btn-danger me-1',
			rejectButtonStyleClass: 'btn btn-success me-1',
			closeOnEscape: true,
			accept: () => {
				this.proceedDeletion(id);
			},
			reject: () => {
				this.toast.showWarn('Product deletion cancelled!');
			},
		});
	}

	private proceedDeletion(id: string) {
		this.productService.deleteProduct(id).subscribe({
			next: () => {
				this.toast.showSuccess('Product deleted successfully');
				this.loadProducts(this.currentEvent);
			},
			error: (error) => {
				this.toast.showError("Product couldn't be deleted");
				console.warn(error);
				this.loadProducts(this.currentEvent);
			},
		});
	}

	private _getProductCount() {
		this.productService.getProductsCount().subscribe((count) => {
			this.totalProducts = count;
			this.dataIsLoaded = true;
		});
	}

	editProduct(id: string) {
		this.router.navigateByUrl(`/products/edit/${id}`);
	}

	loadProducts(event: LazyLoadEvent) {
		this.loading = true;
		const first = event.first ? event.first : 0;
		const rows = event.rows ? event.rows : 999999999;
		const sortField = event.sortField ? event.sortField : 'name';
		const sortOrder = event.sortOrder ? event.sortOrder : 1;
		this.currentEvent = event;
		this._getProductCount();
		setTimeout(() => {
			return this.productService
				.getProducts(first, rows, sortField, sortOrder)
				.subscribe((prod) => {
					this.products = prod;
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
