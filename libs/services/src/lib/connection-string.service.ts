import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConnectionStringService {
  INIT_URL = 'http://localhost:3000';
  API_URL = `${this.INIT_URL}/api/v1/`;
  // constructor() { }
}
