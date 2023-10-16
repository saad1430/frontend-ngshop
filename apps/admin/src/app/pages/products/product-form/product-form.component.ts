import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoriesService, Category, Product, ProductsService } from '@ecommerce/products';
import { ToastService } from '@ecommerce/services';

@Component({
	selector: 'admin-product-form',
	templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit {
	loading = false;
	form!: FormGroup;
	isSubmitted = false;
	isValid = false;
	editMode = false;
	editingId!: string;
  categories: Category[];

	constructor(
		private fb: FormBuilder,
		private productService: ProductsService,
		private toast: ToastService,
		private router: Router,
		private activeLink: ActivatedRoute,
    private categoryService: CategoriesService
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
			richDescription: [
				'',
				Validators.compose([Validators.required, Validators.minLength(100)]),
			],
			image: ['', Validators.required],
			images: [''],
			brand: ['', Validators.required],
			price: ['', Validators.compose([Validators.required, Validators.min(1)])],
			category: ['', Validators.required],
			countInStock: [
				'',
				Validators.compose([Validators.required, Validators.min(1)]),
			],
			isFeatured: [false],
		});
	}

	private _checkEditMode() {
		this.activeLink.params.subscribe((params) => {
			if (params.id) {
				this.editMode = true;
				this.editingId = params.id;
				this.productService.getProduct(params.id).subscribe((prod) => {
					this.form.setValue({
						name: prod.name,
						description: prod.description,
						richDescription: prod.richDescription,
						image: prod.image,
						images: prod.images,
						brand: prod.brand,
						price: prod.price,
						category: prod.category,
						countInStock: prod.countInStock,
						isFeatured: prod.isFeatured,
					});
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
			const prod: Product = {
				name: this.fc.name.value,
				description: this.fc.description.value,
				richDescription: this.fc.richDescription.value,
				image: this.fc.image.value,
				images: this.fc.images.value,
				brand: this.fc.brand.value,
				price: this.fc.price.value,
				category: this.fc.category.value,
				countInStock: this.fc.countInStock.value,
				isFeatured: this.fc.isFeatured.value,
			};
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

	private _add(prod: Product) {
		this.productService.createProduct(prod).subscribe({
			next: (Product: Product) => {
				this.toast.showSuccess(`Product '${Product.name}' added successfully`);
				this.router.navigateByUrl('/products');
			},
			error: (error) => {
				this.toast.showError("Product couldn't be added");
				this.toast.showError(error, 'Error:', true);
				console.warn(error);
			},
		});
	}

	private _update(prod: Product) {
		if (prod.image) {
			if (this.fc.image.untouched) {
				console.warn('Image untouched');
				prod.image = null;
			}
		}
		this.productService.updateProduct(prod, this.editingId).subscribe({
			next: (Product: Product) => {
				this.toast.showSuccess(
					`Product '${Product.name}' updated successfully`,
				);
				this.router.navigateByUrl('/products');
			},
			error: (error) => {
				this.toast.showError("Product couldn't be updated");
				this.toast.showError(error, 'Error:', true);
				console.warn(error);
			},
		});
	}

  private _getCategories(){
    this.categoryService.getCategories().subscribe(cat => {
      this.categories = cat;
    })
  }

}
