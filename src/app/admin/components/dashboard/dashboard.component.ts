// import { Component } from '@angular/core';
// import { AdminService } from '../../service/admin.service';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Title } from '@angular/platform-browser';
// import { debounceTime } from 'rxjs/operators';
// import { MatSnackBar } from '@angular/material/snack-bar';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss'],
// })
// export class DashboardComponent {
//   products: any[] = [];
//   searchProductForm!: FormGroup;
//   totalElements: number = 0;
//   currentPage: number = 0;
//   pageSize: number = 10;
//   sort: string = 'id,asc'; // Default sort by ID in ascending order

//   constructor(
//     private adminService: AdminService,
//     private fb: FormBuilder,
//     private snackBar: MatSnackBar
//   ) {}

//   ngOnInit() {
//     this.getAllProducts();
//     this.searchProductForm = this.fb.group({
//       title: [null, [Validators.required]],
//     });
//     this.searchProductForm
//       .get('title')
//       ?.valueChanges.pipe(
//         // Optional: add debounce to reduce API calls
//         debounceTime(300)
//       )
//       .subscribe((value: string) => {
//         this.products = [];

//         if (value && value.trim().length > 0) {
//           this.adminService
//             .getAllProductsByName(value.trim())
//             .subscribe((res) => {
//               res.forEach((element) => {
//                 element.processedImg =
//                   'data:image/jpeg;base64,' + element.byteImg;
//                 this.products.push(element);
//               });
//             });
//         } else {
//           this.getAllProducts(); // fallback to all products if search is cleared
//         }
//       });
//   }

//   getAllProducts() {
//     this.products = [];
//     this.adminService.getAllProducts().subscribe((res) => {
//       res.forEach((element) => {
//         element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
//         this.products.push(element);
//       });
//       console.log(this.products);
//     });
//   }

//   getAllProducts(page: number, size: number, sort: string) {
//     this.products = [];
//     this.adminService.getAllProducts(page, size, sort).subscribe((res) => {
//       console.log('Backend Response:', res); // Log for debugging
//       this.products = res.content.map((element: any) => ({
//         ...element,
//         processedImg: element.img ? data:image/jpeg;base64,${element.img} : null,
//       }));
//       this.totalElements = res.totalElements;
//       console.log('Processed Products:', this.products);
//     });
//   }

//   submitForm() {
//     this.products = [];
//     const title = this.searchProductForm.get('title')!.value;
//     this.adminService.getAllProductsByName(title).subscribe((res) => {
//       res.forEach((element) => {
//         element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
//         this.products.push(element);
//       });
//       console.log(this.products);
//     });
//   }

//   deleteProduct(productId: any) {
//     this.adminService.deleteProduct(productId).subscribe((res) => {
//       if (res.body == null) {
//         this.snackBar.open('Product Deleted Successfully!', 'Close', {
//           duration: 5000,
//         });
//         this.getAllProducts();
//       } else {
//         this.snackBar.open(res.message, 'Close', {
//           duration: 5000,
//           panelClass: 'error-snackbar',
//         });
//       }
//     });
//   }
// }

import { Component } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  products: any[] = [];
  searchProductForm!: FormGroup;
  totalElements: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  sort: string = 'id,asc'; // Default sort by ID in ascending order

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getAllProducts(this.currentPage, this.pageSize, this.sort);
    this.searchProductForm = this.fb.group({
      title: [null, [Validators.required]],
    });

    this.searchProductForm
      .get('title')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((value: string) => {
        this.products = [];
        if (value && value.trim().length > 0) {
          this.adminService
            .getAllProductsByName(value.trim())
            .subscribe((res) => {
              res.content.forEach((element: any) => {
                element.processedImg =
                  'data:image/jpeg;base64,' + element.byteImg;
                this.products.push(element);
              });
            });
        } else {
          this.getAllProducts(this.currentPage, this.pageSize, this.sort);
        }
      });
  }

  getAllProducts(page: number, size: number, sort: string) {
    this.products = [];
    this.adminService.getAllProducts(page, size, sort).subscribe((res) => {
      console.log('Backend Response:', res); // Log for debugging
      this.products = res.content.map((element: any) => ({
        ...element,
        processedImg: element.img
          ? `data:image/jpeg;base64,${element.img}`
          : null,
      }));
      this.totalElements = res.totalElements;
      console.log('Processed Products:', this.products);
    });
  }

  submitForm() {
    const title = this.searchProductForm.get('title')!.value;
    this.products = [];
    this.adminService.getAllProductsByName(title).subscribe((res) => {
      console.log('API Response:', res); // Log the full API response
      res.content.forEach((element: any) => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
      console.log('Processed Products:', this.products); // Log the processed products
    });
  }

  deleteProduct(productId: any) {
    this.adminService.deleteProduct(productId).subscribe((res) => {
      if (res.body == null) {
        this.snackBar.open('Product Deleted Successfully!', 'Close', {
          duration: 5000,
        });
        this.getAllProducts(this.currentPage, this.pageSize, this.sort);
      } else {
        this.snackBar.open(res.message, 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar',
        });
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAllProducts(this.currentPage, this.pageSize, this.sort);
  }

  onSortChange(sortField: string, sortDirection: string) {
    this.sort = `${sortField},${sortDirection}`;
    this.getAllProducts(this.currentPage, this.pageSize, this.sort);
  }
}
