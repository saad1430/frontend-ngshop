import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor, UsersModule } from '@ecommerce/users';

import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';

import { QuillModule } from 'ngx-quill';

import { AppComponent } from './app.component';
import { DashbaordComponent } from './pages/dashbaord/dashbaord.component';
import { ShellComponent } from './shared/shell/shell.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CategoryListComponent } from './pages/categories/category-list/category-list.component';
import { CategoryFormComponent } from './pages/categories/category-form/category-form.component';
import { ProductFormComponent } from './pages/products/product-form/product-form.component';
import { ProductListComponent } from './pages/products/product-list/product-list.component';
import { PaginatorComponent } from './shared/paginator/paginator.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UserFormComponent } from './pages/users/user-form/user-form.component';
import { OrderListComponent } from './pages/orders/order-list/order-list.component';
import { OrderDetailComponent } from './pages/orders/order-detail/order-detail.component';

const UX_MODULES = [
	TableModule,
	ToastModule,
	TooltipModule,
	ImageModule,
	ConfirmDialogModule,
	InputNumberModule,
	QuillModule,
	DropdownModule,
];

@NgModule({
	declarations: [
		AppComponent,
		DashbaordComponent,
		ShellComponent,
		SidebarComponent,
		FooterComponent,
		CategoryListComponent,
		CategoryFormComponent,
		ProductFormComponent,
		ProductListComponent,
		PaginatorComponent,
		UserListComponent,
		UserFormComponent,
		OrderListComponent,
		OrderDetailComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
		UsersModule,
		HttpClientModule,
		UX_MODULES,
	],
	providers: [MessageService, ConfirmationService, {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}],
	bootstrap: [AppComponent],
})
export class AppModule {}
