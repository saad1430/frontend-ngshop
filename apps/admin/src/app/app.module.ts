import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';

import { AppComponent } from './app.component';
import { DashbaordComponent } from './pages/dashbaord/dashbaord.component';
import { ShellComponent } from './shared/shell/shell.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CategoryListComponent } from './pages/categories/category-list/category-list.component';
import { CategoryFormComponent } from './pages/categories/category-form/category-form.component';
import { ProductFormComponent } from './pages/products/product-form/product-form.component';
import { ProductListComponent } from './pages/products/product-list/product-list.component';

const UX_MODULES = [
	TableModule,
	ToastModule,
	TooltipModule,
	ImageModule,
	ConfirmDialogModule,
	InputNumberModule,
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
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
		HttpClientModule,
		UX_MODULES,
	],
	providers: [MessageService, ConfirmationService],
	bootstrap: [AppComponent],
})
export class AppModule {}
