import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ConnectionStringService, ToastService } from '@ecommerce/services';
import { Product, ProductsService } from '@ecommerce/products';

@Component({
	selector: 'admin-product-list',
	templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
	loading = true;
	products: Product[] = [];
	url= this.con.INIT_URL;

	constructor(
		private productService: ProductsService,
		private toast: ToastService,
		private confirmationService: ConfirmationService,
		private router: Router,
		private con: ConnectionStringService
	) {}

	ngOnInit(): void {
		this.getProducts();
	}

	private getProducts() {
		this.productService.getProducts().subscribe((prod) => {			
			this.products = prod;
			this.loading = false;
			console.log(prod);
		});
	}

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
				this.getProducts();
			},
			error: (error) => {
				this.toast.showError("Product couldn't be deleted");
				console.warn(error);
				this.getProducts();
			},
		});
	}

	editProduct(id: string) {
		console.log(id);
		this.router.navigateByUrl(`/products/edit/${id}`);
	}

}
