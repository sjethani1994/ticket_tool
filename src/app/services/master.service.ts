import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthCredentials } from '../models/login.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  constructor(private http: HttpClient) {}

  // apiUrl: String = '';
  private apiUrl = environment.apiUrl;

  public headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  login(credentials: AuthCredentials): Observable<any> {
    const url = `${this.apiUrl}Login`;
    return this.http.post(url, credentials, { headers: this.headers });
  }
}
