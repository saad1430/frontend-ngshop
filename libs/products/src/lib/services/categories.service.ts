import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { Icons } from '../models/icons';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http:HttpClient) {

  }

  getCategories(): Observable<Category[]>{
    return this.http.get<Category[]>('http://localhost:3000/api/v1/category');
  }

  getIcons(): Observable<Icons[]>{
    return this.http.get<Icons[]>('http://localhost:3000/api/v1/icon');
  }
}
