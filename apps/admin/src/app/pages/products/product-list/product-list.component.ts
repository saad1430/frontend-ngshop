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
	lastItem = 1;
	currentPage = 1;
	totalPages = 1;
	pages: number[] = [];
	maxPagination = 2;
	rows:string;

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
			this.totalPages = Math.ceil(this.totalProducts / this.currentEvent.rows);
			this.firstItem = this.currentEvent.first + 1;
			if (this.isLastPage()) {
				this.lastItem = this.totalProducts;
			} else {
				this.lastItem = this.currentEvent.first + this.currentEvent.rows;
			}
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
		this.rows = this.currentEvent.rows.toString();
		this._getProductCount();
		setTimeout(() => {
			return this.productService
				.getProducts(first, rows, sortField, sortOrder)
				.subscribe((prod) => {
					this.products = prod;
					this.getPages();
					this.loading = false;
				});
		}, 50);
	}

	next() {
		if (this.currentEvent.first >= this.totalProducts) return;
		this.currentEvent.first = this.currentEvent.first + this.currentEvent.rows;
		this.currentPage += 1;
		this.loadProducts(this.currentEvent);
	}

	prev() {
		if (this.currentEvent.first <= 0) return;
		this.currentEvent.first = this.currentEvent.first - this.currentEvent.rows;
		this.currentPage -= 1;
		this.loadProducts(this.currentEvent);
	}

	first() {
		if (this.currentEvent.first == 0) return;
		this.currentEvent.first = 0;
		this.currentPage = 1;
		this.loadProducts(this.currentEvent);
	}

	last() {
		if (this.currentEvent.first + this.currentEvent.rows == this.totalProducts)
			return;
		this.currentPage = this.totalPages;
		this.currentEvent.first = (this.totalPages - 1) * this.currentEvent.rows;
		this.loadProducts(this.currentEvent);
	}

	isLastPage(): boolean {
		return this.products
			? this.currentEvent.first >= this.totalProducts - this.currentEvent.rows
			: true;
	}

	isFirstPage(): boolean {
		return this.products ? this.currentEvent.first === 0 : true;
	}

	goToPage(page: number) {
		this.currentEvent.first =
			page * this.currentEvent.rows - this.currentEvent.rows;
		this.currentPage = page;
		console.log(`First: ${this.currentEvent.first}, Last: ${this.lastItem}, Page: ${page}`);
		this.loadProducts(this.currentEvent);
	}

	rowUpdate(){
		this.currentEvent.rows = parseInt(this.rows)
		this.loadProducts(this.currentEvent);
	};

	private getPages() {
		this.pages = [];
		for (
			let i = Math.max(1, this.currentPage - this.maxPagination);
			i <= Math.min(this.totalPages, this.currentPage + this.maxPagination);
			i++
		) {
			this.pages.push(i);
		}
	}
}
