import { Route } from '@angular/router';

import { ShellComponent } from './shared/shell/shell.component';
import { DashbaordComponent } from './pages/dashbaord/dashbaord.component';
import { CategoryListComponent } from './pages/categories/category-list/category-list.component';
import { CategoryFormComponent } from './pages/categories/category-form/category-form.component';
import { ProductListComponent } from './pages/products/product-list/product-list.component';
import { ProductFormComponent } from './pages/products/product-form/product-form.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UserFormComponent } from './pages/users/user-form/user-form.component';

export const appRoutes: Route[] = [
	{
		path: '',
		component: ShellComponent,
		children: [
			{ path: 'dashboard', component: DashbaordComponent },
			{ path: 'categories', component: CategoryListComponent },
			{ path: 'categories/new', component: CategoryFormComponent },
			{ path: 'categories/edit/:id', component: CategoryFormComponent },
			{ path: 'products', component: ProductListComponent },
			{ path: 'products/new', component: ProductFormComponent },
			{ path: 'products/edit/:id', component: ProductFormComponent },
			{ path: 'users', component: UserListComponent },
			{ path: 'users/new', component: UserFormComponent },
			{ path: 'users/edit/:id', component: UserFormComponent },
		],
	},
];
