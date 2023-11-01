/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  // constructor() { }

  setItem(key:any, value:any){
    localStorage.setItem(key, value);
  }

  getItem(key:any){
   return localStorage.getItem(key);
  }

  clear(){
    localStorage.clear();
  }
}
