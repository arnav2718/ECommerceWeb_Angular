import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-view-product-detail',
  templateUrl: './view-product-detail.component.html',
  styleUrls: ['./view-product-detail.component.scss'],
})
export class ViewProductDetailComponent {
  productId: number = this.activatedRoute.snapshot.params['productId'];

  product: any;
  FAQS: any[] = [];
  reviews: any[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getProductDetailById();
  }

  getProductDetailById() {
    this.customerService
      .getProductDetailById(this.productId)
      .subscribe((res) => {
        this.product = res.productDto;
        this.product.processedImg =
          'data:image/png;base64,' + res.productDto.byteImg;

        this.FAQS = res.faqDtoList;

        res.reviewDtoList.forEach((element) => {
          element.processedImg = 'data:image/png;base64,' + element.returnedImg;
          this.reviews.push(element);
        });
      });
  }
}
