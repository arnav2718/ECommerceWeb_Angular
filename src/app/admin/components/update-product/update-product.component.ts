import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss'],
})
export class UpdateProductComponent {
  productId = this.activatedroute.snapshot.params['productId'];

  productForm: FormGroup;
  listofCategories: any[] = [];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  existingImage: string | null = null;

  imgChanged = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private activatedroute: ActivatedRoute
  ) {}

  // Lifecycle hook, correct the typo here
  ngOnInit(): void {
    this.productForm = this.fb.group({
      categoryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });

    this.getAllCategories();
    this.getProductById();
  }

  // Get categories from the backend
  getAllCategories(): void {
    this.adminService.getAllCategories().subscribe((res) => {
      this.listofCategories = res;
    });
  }

  //Updating the product
  getProductById() {
    this.adminService.getProductById(this.productId).subscribe((res) => {
      this.productForm.patchValue(res);

      this.existingImage = 'data:image/jpeg;base64,' + res.byteImg;
    });
  }
  // Handle file selection and preview
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.previewImage();
    this.imgChanged = true;

    this.existingImage = null;
  }

  // Preview image after selection
  previewImage(): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    if (this.selectedFile) {
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Update product method with FormData for file upload
  updateProduct(): void {
    if (this.productForm.valid) {
      console.log('hello');
      const formData: FormData = new FormData();

      if (this.imgChanged && this.selectedFile) {
        formData.append('img', this.selectedFile);
      }

      formData.append('categoryId', this.productForm.get('categoryId')?.value);
      formData.append('name', this.productForm.get('name')?.value);
      formData.append(
        'description',
        this.productForm.get('description')?.value
      );
      formData.append('price', this.productForm.get('price')?.value);

      this.adminService
        .updateProduct(this.productId, formData)
        .subscribe((res) => {
          console.log(res);
          if (res.id != null) {
            this.snackBar.open('Product updated successfully', 'Close', {
              duration: 5000,
            });
            this.router.navigateByUrl('/admin/dashboard');
          } else {
            this.snackBar.open(res.message, 'ERROR', {
              duration: 5000,
            });
          }
        });
    } else {
      for (const i in this.productForm.controls) {
        this.productForm.controls[i].markAsDirty();
        this.productForm.controls[i].updateValueAndValidity();
      }
    }
  }
}
