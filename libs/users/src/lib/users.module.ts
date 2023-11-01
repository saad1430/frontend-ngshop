import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { usersRoutes } from './lib.routes';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(usersRoutes),
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
	],
	declarations: [LoginComponent],
})
export class UsersModule {}
