import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@ecommerce/services';

@Component({
	selector: 'admin-shell',
	templateUrl: './shell.component.html',
})
export class ShellComponent implements OnInit {
	constructor(private ls: LocalStorageService) {}
	ngOnInit(): void {
		const layout = this.ls.getItem('layout');
		const body = document.getElementById('admin-body');
		if (layout == 'unboxed') {
			if (body) {
				body.classList.replace('container','container-fluid');
			}
		} else {
			if (body) {
				body.classList.replace('container-fluid', 'container');
			}
		}
	}
}
