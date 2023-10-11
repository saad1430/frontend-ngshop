import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService, Icons } from '@ecommerce/products';

@Component({
  selector: 'admin-category-form',
  templateUrl: './category-form.component.html',
})
export class CategoryFormComponent implements OnInit {
  icons: Icons[] = [];
  selectedIcon: string;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.categoryService.getIcons().subscribe((icon) => {
      this.icons = icon;
    });
    this.form = this.fb.group({
      name: ['', Validators.required],
      icon: [this.selectedIcon, Validators.required],
      color: ['#000000', Validators.required],
      image: [''],
    });
    this.form.get('icon').valueChanges.subscribe((value) => {
      this.selectedIcon = value;
    });

  }
  onSubmit(){
    console.log(this.form.controls);
    
  };
}
