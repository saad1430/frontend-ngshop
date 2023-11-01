import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';

@Component({
	selector: 'admin-paginator',
	templateUrl: './paginator.component.html',
})
export class PaginatorComponent implements OnInit {
	@Input() currentEvent: LazyLoadEvent; // Define the type as per your requirements
	@Input() totalItems: number;
	items = [];
	currentPage = 1;
	totalPages = 1;
	pages: number[] = [];
	rows: string;
	maxPagination = 2;
	firstItem = 1;
	lastItem = 1;
	@Output() pageChange: EventEmitter<LazyLoadEvent> = new EventEmitter();
	@Output() FirstPage: EventEmitter<boolean> = new EventEmitter();
	@Output() LastPage: EventEmitter<boolean> = new EventEmitter();
	@Output() ourFirstItem: EventEmitter<number> = new EventEmitter();
	@Output() ourLastItem: EventEmitter<number> = new EventEmitter();

	ngOnInit(): void {
		this.getPages();
	}

	next() {
		if (this.currentEvent.first >= this.totalItems) return;
		this.currentEvent.first = this.currentEvent.first + this.currentEvent.rows;
		this.currentPage += 1;
		this.getPages();
		this.pageChange.emit(this.currentEvent);
	}

	prev() {
		if (this.currentEvent.first <= 0) return;
		this.currentEvent.first = this.currentEvent.first - this.currentEvent.rows;
		if (this.currentEvent.first < 0) this.currentEvent.first = 0;
		this.currentPage -= 1;
		this.updateFirstAndLastItems();
		this.getPages();
		this.pageChange.emit(this.currentEvent);
	}

	first() {
		if (this.currentEvent.first == 0) return;
		this.currentEvent.first = 0;
		this.currentPage = 1;
		this.getPages();
		this.pageChange.emit(this.currentEvent);
	}

	last() {
		this.currentPage = this.totalPages + 1;
		this.currentEvent.first = this.totalPages * this.currentEvent.rows;
		this.getPages();
		this.pageChange.emit(this.currentEvent);
	}

	isLastPage(): boolean {
		return this.items
			? this.currentEvent.first >= this.totalItems - this.currentEvent.rows
			: true;
	}

	isFirstPage(): boolean {
		return this.items ? this.currentEvent.first === 0 : true;
	}

	goToPage(page: number) {
		this.currentEvent.first =
			page * this.currentEvent.rows - this.currentEvent.rows;
		if (this.currentEvent.first < 0) this.currentEvent.first = 0;
		this.currentPage = page;
		this.getPages();
		this.pageChange.emit(this.currentEvent);
	}

	private calculateTotalPages() {
		this.totalPages = Math.ceil(this.totalItems / this.currentEvent.rows) - 1;
	}

	getPages() {
		this.calculateTotalPages();
		this.rows = this.currentEvent.rows.toString();
		this.pages = [];
		for (
			let i = Math.max(1, this.currentPage - 2);
			i <= Math.min(this.totalPages + 1, this.currentPage + 2);
			i++
		) {
			this.pages.push(i);
		}
		this.updateFirstAndLastItems();
	}

	updateFirstAndLastItems() {
		this.firstItem = (this.currentPage - 1) * this.currentEvent.rows + 1;
		if (this.isLastPage()) {
			this.lastItem = this.totalItems;
		} else {
			this.lastItem = this.currentEvent.first + this.currentEvent.rows;
		}
		// Emit the changes
		this.ourFirstItem.emit(this.firstItem);
		this.ourLastItem.emit(this.lastItem);
	}

	rowUpdate() {
		this.currentEvent.rows = parseInt(this.rows);
		this.getPages();
		this.pageChange.emit(this.currentEvent);
	}
}
