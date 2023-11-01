import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Order, OrdersService } from '@ecommerce/orders';
import { ConnectionStringService, ToastService } from '@ecommerce/services';

@Component({
	selector: 'admin-order-detail',
	templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent implements OnInit {
	loading = false;
	order?: Order;
	form!: FormGroup;
	isSubmitted = false;
	isValid = false;
	editMode = false;
	editingId!: string;
	url = this.con.INIT_URL;
	imageUrl: string;
	order_status = this.orderService.ORDER_STATUS;
	orderStatus = [];

	constructor(
		private fb: FormBuilder,
		private orderService: OrdersService,
		private toast: ToastService,
		private router: Router,
		private activeLink: ActivatedRoute,
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
		this._mapOrderStatus();
	}

	private _mapOrderStatus() {
		this.orderStatus = Object.keys(this.order_status).map((key) => {
			return { id: key, name: this.order_status[key].label };
		});
	}

	private _formBuilder() {
		this.form = this.fb.group({
			status: ['', Validators.required],
		});
	}

	private _checkEditMode() {
		this.activeLink.params.subscribe((params) => {
			if (params.id) {
				this.editMode = true;
				this.editingId = params.id;
				this.orderService.getOrder(params.id).subscribe((res) => {
					this.order = res;
					console.log(res);
					this.form.setValue({
						status: this.order.status,
					});
					this.loading = false;
				});
			}
		});
	}

	onSubmit() {
		this.isSubmitted = true;
		if (this.form.valid) {
			this.isValid = true;
			const order: Order = {
				status: this.fc.status.value,
			};
			this._update(order);
		} else {
			this.toast.showError('Please fill all the required fields');
			return;
		}
	}

	private _update(order: Order) {
		this.orderService.updateOrder(order, this.editingId).subscribe({
			next: () => {
				this.toast.showSuccess(`Order updated successfully`);
				this.router.navigateByUrl('/orders');
			},
			error: (error) => {
				this.toast.showError("Order couldn't be updated");
				this.toast.showError(error, 'Error:', true);
				this._cantSend();
				console.warn(error);
			},
		});
	}

	private _cantSend() {
		this.isValid = false;
		const element = document.getElementById('submit-btn');
		if (element) {
			element.innerHTML = `<i class="far fa-save me-2"></i>${
				this.editMode ? 'Update' : 'Save'
			}`;
		}
	}
}
