import { Component, OnInit } from '@angular/core';
import { CategoriesService, Category } from '@ecommerce/products';
import { ToastService } from '../../../services/toast.service';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
// import { SortEvent } from 'primeng/api';

@Component({
  selector: 'admin-category-list',
  templateUrl: './category-list.component.html',
})
export class CategoryListComponent implements OnInit {
  loading = true;
  categories: Category[] = [];

  constructor(
    private categoryService: CategoriesService,
    private toast: ToastService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  private getCategories() {
    this.categoryService.getCategories().subscribe((cats) => {
      this.categories = cats;
      this.loading = false;
    });
  }

  deleteCategory(id: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this category?',
      header: 'Delete Category',
      icon: 'far fa-exclamation-triangle',
      acceptButtonStyleClass: 'btn btn-danger me-1',
      rejectButtonStyleClass: 'btn btn-success me-1',
      closeOnEscape: true,
      accept: () => {
        this.proceedDeletion(id);
      },
      reject: () => {
        this.toast.showWarn('Category deletion cancelled!');
      },
    });
  }

  private proceedDeletion(id: string) {
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.toast.showSuccess('Category deleted successfully');
        this.getCategories();
      },
      error: (error) => {
        this.toast.showError("Category couldn't be deleted");
        console.warn(error);
        this.getCategories();
      },
    });
  }

  editCategory(id: string) {
    console.log(id);
    this.router.navigateByUrl(`/categories/edit/${id}`);
  }

  // customSort(event: SortEvent) {
  //   event.data.sort((data1, data2) => {
  //     const value1 = data1[event.field];
  //     const value2 = data2[event.field];
  //     let result = null;

  //     if (value1 == null && value2 != null) result = -1;
  //     else if (value1 != null && value2 == null) result = 1;
  //     else if (value1 == null && value2 == null) result = 0;
  //     else if (typeof value1 === 'string' && typeof value2 === 'string')
  //       result = value1.localeCompare(value2);
  //     else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

  //     return event.order * result;
  //   });
  // }
}
