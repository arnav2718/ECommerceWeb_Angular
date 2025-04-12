import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStorageService } from 'src/app/services/storage/user-storage.service';

const BASIC_URL1 = 'http://localhost:8765/ecommproservice/';

const BASIC_URL2 = 'http://localhost:8765/ecommorderservice/';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any> {
    return this.http.get(BASIC_URL1 + 'api/customer/products', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getAllProductsByName(name: any): Observable<any> {
    return this.http.get(BASIC_URL1 + `api/customer/search/${name}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  addToCart(productId: any): Observable<any> {
    const cartDto = {
      productId: productId,
      userId: UserStorageService.getUserId(),
    };
    // console.log(cartDto.productId);
    // console.log(cartDto.userId);
    return this.http.post(BASIC_URL2 + `api/customer/cart`, cartDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  increaseProductQuantity(productId: any): Observable<any> {
    const cartDto = {
      productId: productId,
      userId: UserStorageService.getUserId(),
    };
    return this.http.post(BASIC_URL2 + `api/customer/addition`, cartDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  decreaseProductQuantity(productId: any): Observable<any> {
    const cartDto = {
      productId: productId,
      userId: UserStorageService.getUserId(),
    };
    return this.http.post(BASIC_URL2 + `api/customer/deduction`, cartDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getCartByUserId(): Observable<any> {
    const userId = UserStorageService.getUserId();
    return this.http.get(BASIC_URL2 + `api/customer/cart/${userId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  placeOrder(OrderDto: any): Observable<any> {
    OrderDto.userId = UserStorageService.getUserId();
    return this.http.post(BASIC_URL2 + `api/customer/placeOrder`, OrderDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getOrdersByUserId(): Observable<any> {
    const userId = UserStorageService.getUserId();
    return this.http.get(BASIC_URL2 + `api/customer/myOrders/${userId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getOrderedProducts(orderId: number): Observable<any> {
    return this.http.get(
      BASIC_URL2 + `api/customer/ordered-products/${orderId}`,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  giveReview(reviewDto: any): Observable<any> {
    return this.http.post(BASIC_URL2 + `api/customer/review`, reviewDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getProductDetailById(productId: number): Observable<any> {
    return this.http.get(
      BASIC_URL1 + `api/customer/product/${productId}`,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization',
      'Bearer ' + UserStorageService.getToken()
    );
  }
}
