import { Component, OnInit } from '@angular/core';
import { CategoriesService, Category } from '@ecommerce/products';

@Component({
  selector: 'admin-category-list',
  templateUrl: './category-list.component.html',
})
export class CategoryListComponent implements OnInit {
  loadingIndicator = true;
  categories: Category[] = [];
  categoriesModel = [
    { prop: 'id' },
    { name: 'name' },
    { name: 'icon' },
    { name: 'color' },
    { name: 'image' },
  ];

  constructor(private categoryService: CategoriesService) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((cats) => {
      this.categories = cats;
      this.loadingIndicator = false;
    });
  }
}
