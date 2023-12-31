import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService, Category, Icons } from '@ecommerce/products';
import { ToastService } from '@ecommerce/services';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'admin-category-form',
	templateUrl: './category-form.component.html',
})
export class CategoryFormComponent implements OnInit, OnDestroy {
	loading = false;
	icons: Icons[] = [];
	form!: FormGroup;
	isSubmitted = false;
	isValid = false;
	editMode = false;
	editingId!: string;
	endSub$: Subject<any> = new Subject();

	constructor(
		private fb: FormBuilder,
		private categoryService: CategoriesService,
		private toast: ToastService,
		private router: Router,
		private activeLink: ActivatedRoute,
	) {}

	ngOnInit(): void {
		this._initForm();
	}

	ngOnDestroy(): void {
		this.endSub$.complete();
	}

	private _initForm() {
		this.loading = true;
		this._getIcons();
		this._formBuilder();
		this._checkNoIcons();
		this._checkEditMode();
		this.loading = false;
	}

	get catForm() {
		return this.form.controls;
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
			const cat: Category = {
				name: this.catForm.name.value,
				icon: this.catForm.icon.value,
				color: this.catForm.color.value,
				image: this.catForm.image.value,
			};
			if (this.editMode) {
				this._updateCategory(cat);
			} else {
				this._addCategory(cat);
			}
		} else {
			this.toast.showError('Please fill all the required fields');
			return;
		}
	}

	private _getIcons() {
		this.categoryService
			.getIcons()
			.pipe(takeUntil(this.endSub$))
			.subscribe((icon) => {
				this.icons = icon;
			});
	}

	private _checkNoIcons() {
		if (this.icons.length < 1) {
			this.icons = [
				{
					icon: 'fa fa-refresh',
					name: 'Data could not be loaded please reload page',
				},
			];
		}
	}

	private _checkEditMode() {
		this.activeLink.params.subscribe((params) => {
			if (params.id) {
				this.editMode = true;
				this.editingId = params.id;
				this.categoryService.getCategory(params.id).subscribe((cat) => {
					this.form.setValue({
						name: cat.name,
						icon: cat.icon,
						color: cat.color,
						image: cat.image,
					});
				});
			}
		}).unsubscribe();
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
			icon: ['', Validators.required],
			color: ['', Validators.required],
			image: [''],
		});
	}

	private _addCategory(cat: Category) {
		this.categoryService
			.createCategory(cat)
			.pipe(takeUntil(this.endSub$))
			.subscribe({
				next: (category: Category) => {
					this.toast.showSuccess(
						`Category '${category.name}' added successfully`,
					);
					this.router.navigateByUrl('/categories');
				},
				error: (error) => {
					this.toast.showError("Category couldn't be added");
					console.warn(error);
				},
			});
	}

	private _updateCategory(cat: Category) {
		// if(cat.image){
		//   if(this.catForm.image.untouched){
		//     console.warn('Image untouched')
		//     cat.image = null;
		//   }
		// }
		this.categoryService
			.updateCategory(cat, this.editingId)
			.pipe(takeUntil(this.endSub$))
			.subscribe({
				next: (category: Category) => {
					this.toast.showSuccess(
						`Category '${category.name}' updated successfully`,
					);
					this.router.navigateByUrl('/categories');
				},
				error: (error) => {
					this.toast.showError("Category couldn't be updated");
					this.toast.showError(error, 'Error:', true);
					console.warn(error);
				},
			});
	}
}
