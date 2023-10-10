import { Component, OnInit } from '@angular/core';
import { CategoriesService, Icons } from '@ecommerce/products';

@Component({
  selector: 'admin-category-form',
  templateUrl: './category-form.component.html',
})
export class CategoryFormComponent implements OnInit {
  icons: Icons[] = [];
  constructor(private categoryService: CategoriesService) {}
  ngOnInit(): void {
    this.categoryService.getIcons().subscribe((icon) => {
      this.icons = icon;
    });
  }
}
