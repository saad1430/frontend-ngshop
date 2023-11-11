import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ToastService } from '@ecommerce/services';
import { Order, OrdersService } from '@ecommerce/orders';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'admin-order-list',
	templateUrl: './order-list.component.html',
})
export class OrderListComponent implements OnDestroy {
	loading = true;
	orders: Order[] = [];
	totalOrders: number;
	currentEvent: LazyLoadEvent;
	firstItem = 1;
	rows = 5;
	lastItem = this.rows;
	dataIsLoaded = false;
	order_status = this.orderService.ORDER_STATUS;
	endSub$: Subject<any> = new Subject();

	constructor(
		private orderService: OrdersService,
		private toast: ToastService,
		private confirmationService: ConfirmationService,
		private router: Router,
	) {}

	ngOnDestroy(): void {
		this.endSub$.complete();
	}

	deleteOrder(id: string) {
		this.confirmationService.confirm({
			message: 'Do you want to delete this Order?',
			header: 'Delete Order',
			icon: 'far fa-exclamation-triangle',
			acceptButtonStyleClass: 'btn btn-danger me-1',
			rejectButtonStyleClass: 'btn btn-success me-1',
			closeOnEscape: true,
			accept: () => {
				this.proceedDeletion(id);
			},
			reject: () => {
				this.toast.showWarn('Order deletion cancelled!');
			},
		});
	}

	private proceedDeletion(id: string) {
		this.orderService
			.deleteOrder(id)
			.pipe(takeUntil(this.endSub$))
			.subscribe({
				next: () => {
					this.toast.showSuccess('Order deleted successfully');
					this.loadOrders(this.currentEvent);
				},
				error: (error) => {
					this.toast.showError("Order couldn't be deleted");
					console.warn(error);
					this.loadOrders(this.currentEvent);
				},
			});
	}

	private _getOrderCount() {
		this.orderService
			.getOrdersCount()
			.pipe(takeUntil(this.endSub$))
			.subscribe((count) => {
				this.totalOrders = count;
				this.dataIsLoaded = true;
			});
	}

	loadOrders(event: LazyLoadEvent) {
		this.loading = true;
		const first = event.first ? event.first : 0;
		const rows = event.rows ? event.rows : 999999999;
		const sortField = event.sortField ? event.sortField : 'dateOrdered';
		const sortOrder = event.sortOrder ? event.sortOrder : -1;
		this.currentEvent = event;
		this._getOrderCount();
		setTimeout(() => {
			return this.orderService
				.getPrivateOrders(first, rows, sortField, sortOrder)
				.pipe(takeUntil(this.endSub$))
				.subscribe((data) => {
					this.orders = data.data;
					this.loading = false;
				});
		}, 50);
	}

	orderDetails(id: string) {
		this.router.navigateByUrl(`/orders/${id}`);
	}

	ourFirstItem(item: number) {
		this.firstItem = item;
	}

	ourLastItem(item: number) {
		this.lastItem = item;
	}
}
