import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
	CategoriesService,
	Category,
	Product,
	ProductsService,
} from '@ecommerce/products';
import { ConnectionStringService, ToastService } from '@ecommerce/services';

@Component({
	selector: 'admin-product-form',
	templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit {
	loading = false;
	product!: Product;
	form!: FormGroup;
	isSubmitted = false;
	isValid = false;
	editMode = false;
	editingId!: string;
	categories?: Category[];
	cat!: Category;
	url = this.con.INIT_URL;
	imageUrl: string;

	constructor(
		private fb: FormBuilder,
		private productService: ProductsService,
		private toast: ToastService,
		private router: Router,
		private activeLink: ActivatedRoute,
		private categoryService: CategoriesService,
		private con: ConnectionStringService,
	) {}

	ngOnInit() {
		this._initForm();
	}

	get fc() {
		return this.form.controls;
	}

	private _initForm() {
		this.loading = true;
		this._formBuilder();
		this._checkEditMode();
		this._getCategories();
		this.loading = false;
	}

	private _formBuilder() {
		this.form = this.fb.group({
			name: [
				'',
				Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(50),
				]),
			],
			description: [
				'',
				Validators.compose([Validators.required, Validators.minLength(30)]),
			],
			richDescription: [''],
			image: ['', Validators.required],
			images: [''],
			brand: ['', Validators.required],
			price: [0, Validators.compose([Validators.required, Validators.min(0)])],
			category: ['', Validators.required],
			countInStock: [
				0,
				Validators.compose([Validators.required, Validators.min(0)]),
			],
			isFeatured: [false],
		});
	}

	private _checkEditMode() {
		this.activeLink.params.subscribe((params) => {
			if (params.id) {
				this.editMode = true;
				this.editingId = params.id;
				this.productService.getProduct(params.id).subscribe((res) => {
					this.product = res.product;
					if (res.success) {
						if (this.product.category) {
							this.cat = this.product.category;
						}
						if (this.product.image) {
							this.imageUrl = this.url + this.product.image;
						}
						this.form.setValue({
							name: this.product.name,
							description: this.product.description,
							richDescription: this.product.richDescription,
							image: this.product.image,
							images: this.product.images,
							brand: this.product.brand,
							price: this.product.price,
							category: this.cat.id,
							countInStock: this.product.countInStock,
							isFeatured: this.product.isFeatured,
						});
					}
				});
			}
		});
	}

	onSubmit() {
		this.isSubmitted = true;
		if (this.form.valid) {
			this.isValid = true;
			const element = document.getElementById('submit-btn');
			if (element) {
				element.innerHTML = `<i class="fa-light fa-spinner fa-spin me-2"></i>${
					this.editMode ? 'Updating' : 'Saving'
				}`;
			}
			const prod = new FormData();
			Object.keys(this.fc).map((key) => {
				prod.append(key, this.fc[key].value);
			});
			if (this.editMode) {
				this._update(prod);
			} else {
				this._add(prod);
			}
		} else {
			this.toast.showError('Please fill all the required fields');
			return;
		}
	}

	private _add(prod: FormData) {
		this.productService.createProduct(prod).subscribe({
			next: () => {
				this.toast.showSuccess(
					`Product added successfully`,
				);
				this.router.navigateByUrl('/products');
			},
			error: (error) => {
				this.toast.showError("Product couldn't be added");
				this.toast.showError(error, 'Error:', true);
				this._cantSend();
				console.warn(error);
			},
		});
	}

	private _update(prod: FormData) {
		this.productService.updateProduct(prod, this.editingId).subscribe({
			next: () => {
				this.toast.showSuccess(
					`Product  updated successfully`,
				);
				this.router.navigateByUrl('/products');
			},
			error: (error) => {
				this.toast.showError("Product couldn't be updated");
				this.toast.showError(error, 'Error:', true);
				this._cantSend();
				console.warn(error);
			},
		});
	}

	private _getCategories() {
		this.categoryService.getCategories().subscribe((cat) => {
			this.categories = cat;
		});
	}

	private _cantSend(){
		this.isValid = false;
		const element = document.getElementById('submit-btn');
		if (element) {
			element.innerHTML = `<i class="far fa-save me-2"></i>${
				this.editMode ? 'Update' : 'Save'
			}`;
		}
	}

	onImageChange(event: Event): void {
		const inputElement = event.target as HTMLInputElement;
		const file = inputElement.files?.[0];

		if (file) {
			this.form.patchValue({ image: file });
			this.form.get('image').updateValueAndValidity();
			// Display the selected image in the preview.
			const reader = new FileReader();
			reader.onload = (e) => {
				this.imageUrl = e.target.result as string;
			};
			reader.readAsDataURL(file);
		}
	}
}
