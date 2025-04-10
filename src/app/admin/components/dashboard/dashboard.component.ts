import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs';
import { AdminService } from '../../service/admin.service';
import { UserStorageService } from 'src/app/services/storage/user-storage.service';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  products: any[] = [];
  searchProductForm!: FormGroup;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getAllProducts();
    this.searchProductForm = this.fb.group({
      title: [null, [Validators.required]],
    });
    this.searchProductForm
      .get('title')
      ?.valueChanges.pipe(
        // Optional: add debounce to reduce API calls
        debounceTime(300)
      )
      .subscribe((value: string) => {
        this.products = [];

        if (value && value.trim().length > 0) {
          this.adminService
            .getAllProductsByName(value.trim())
            .subscribe((res) => {
              res.forEach((element) => {
                element.processedImg =
                  'data:image/jpeg;base64,' + element.byteImg;
                this.products.push(element);
              });
            });
        } else {
          this.getAllProducts(); // fallback to all products if search is cleared
        }
      });
  }

  getAllProducts() {
    this.products = [];
    this.adminService.getAllProducts().subscribe((res) => {
      res.forEach((element) => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
      console.log(this.products);
    });
  }

  submitForm() {
    this.products = [];
    const title = this.searchProductForm.get('title')!.value;
    this.adminService.getAllProductsByName(title).subscribe((res) => {
      res.forEach((element) => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
      console.log(this.products);
    });
  }

  // deleteProduct(productId: any) {
  //   this.adminService.deleteProduct(productId).subscribe((res) => {
  //     if (res.body == null) {
  //       this.snackBar.open('Product Deleted Successfully!', 'Close', {
  //         duration: 5000,
  //       });
  //       this.getAllProducts();
  //     } else {
  //       this.snackBar.open(res.message, 'Close', {
  //         duration: 5000,
  //         panelClass: 'error-snackbar',
  //       });
  //     }
  //   });
  // }
  deleteProduct(productId: any) {
    this.adminService.deleteProduct(productId).subscribe({
      next: (res) => {
        if (res.status === 204) { // HTTP 204: No Content
          this.snackBar.open('Product Deleted Successfully!', 'Close', {
            duration: 5000,
          });
          this.getAllProducts();
        }
      },
      error: (err) => {
        if (err.status === 404) { // Product not found
          this.snackBar.open('Product not found!', 'Close', {
            duration: 5000,
            panelClass: 'error-snackbar',
          });
        } else {
          console.error('Unexpected error:', err);
        }
      },
    });
  }
}
