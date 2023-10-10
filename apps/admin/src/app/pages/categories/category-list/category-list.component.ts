import { Component, OnInit } from '@angular/core';
import { CategoriesService, Category } from '@ecommerce/products';
// import { SortEvent } from 'primeng/api';

@Component({
  selector: 'admin-category-list',
  templateUrl: './category-list.component.html',
})
export class CategoryListComponent implements OnInit {
  loading = true;
  categories: Category[] = [];

  constructor(private categoryService: CategoriesService) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((cats) => {
      this.categories = cats;
      this.loading = false;
    });
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
