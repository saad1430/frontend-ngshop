import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '@ecommerce/services';

@Component({
	selector: 'admin-sidebar',
	templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
	name = 'Default Admin';
	email = 'abc@123.xyz';

	constructor(private ls: LocalStorageService, private router: Router) {}

	ngOnInit(): void {
		this._getNameAndEmail();
    this._checkUndefined();
	}

	private _getNameAndEmail() {
		this.name = this.ls.getItem('name');
    this.email = this.ls.getItem('email');
	}

  private _checkUndefined(){
    if(!this.name || !this.email){
      this.name = 'Default Admin';
			this.email = 'abc@123.xyz';
    }
  }

	logout() {
		this.ls.clear();
		this.router.navigateByUrl('/login');
	}
}
