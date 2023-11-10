import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@ecommerce/services';
import { AuthService } from '@ecommerce/users';

@Component({
	selector: 'admin-sidebar',
	templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
	name = 'Default Admin';
	email = 'abc@123.xyz';

	constructor(private ls: LocalStorageService, private authService: AuthService) {}

	ngOnInit(): void {
		this._getNameAndEmail();
		this._checkUndefined();
	}

	private _getNameAndEmail() {
		this.name = this.ls.getItem('name');
		this.email = this.ls.getItem('email');
	}

	private _checkUndefined() {
		if (!this.name || !this.email) {
			this.name = 'Default Admin';
			this.email = 'abc@123.xyz';
		}
	}

	logout() {
		this.authService.logout();
	}
}
