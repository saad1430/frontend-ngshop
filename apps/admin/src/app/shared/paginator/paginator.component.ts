import { Component } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';

@Component({
	selector: 'admin-paginator',
	templateUrl: './paginator.component.html',
})
export class PaginatorComponent {
	items = [];
	totalItems: number;
	currentEvent: LazyLoadEvent;
	firstItem = 1;
	lastItem = 1;
	currentPage = 1;
	totalPages = 1;
	pages: number[] = [];

	next() {
		if (this.currentEvent.first >= this.totalItems) return;
		this.currentEvent.first = this.currentEvent.first + this.currentEvent.rows;
		this.currentPage += 1;
		return this.currentEvent;
	}

	prev() {
		if (this.currentEvent.first <= 0) return;
		this.currentEvent.first = this.currentEvent.first - this.currentEvent.rows;
		this.currentPage -= 1;
		return this.currentEvent;
	}

	first() {
		if (this.currentEvent.first == 0) return;
		this.currentEvent.first = 0;
		this.currentPage = 1;
		return this.currentEvent;
	}

	last() {
		this.currentPage = this.totalPages + 1;
		this.currentEvent.first = this.totalPages * this.currentEvent.rows;
		return this.currentEvent;
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
		this.currentPage = page;
		console.log(`First: ${this.currentEvent.first}, Page: ${page}`);
		return this.currentEvent;
	}

	getPages() {
		this.pages = [];

		for (
			let i = Math.max(1, this.currentPage - 2);
			i <= Math.min(this.totalPages + 1, this.currentPage + 2);
			i++
		) {
			this.pages.push(i);
		}
		console.log(this.pages);
	}
}
