import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserStorageService } from '../storage/user-storage.service';

const BASIC_URL = 'http://localhost:8765/ecomm/';
const BASIC_URL2 = 'http://localhost:8765/ecommorderservice/';
// const BASIC_URL = 'http://localhost:8081/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private UserStorageService: UserStorageService
  ) {}

  register(signupRequest: any): Observable<any> {
    return this.http.post(BASIC_URL + 'sign-up', signupRequest);
  }

  login(username: string, password: string): Observable<boolean> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { username, password };

    return this.http
      .post(BASIC_URL + 'authenticate', body, { headers, observe: 'response' })
      .pipe(
        map((res) => {
          const authHeader = res.headers.get('authorization');
          const token = authHeader?.startsWith('Bearer ')
            ? authHeader.substring(7)
            : null;
          const user = res.body;

          if (token && user) {
            this.UserStorageService.saveToken(token);
            this.UserStorageService.saveUser(user);
            return true;
          }
          return false;
        })
      );
  }

  getOrderByTrackingId(trackingId: number): Observable<any> {
    return this.http.get(BASIC_URL2 + `order/${trackingId}`);
  }
}
