import {Component, OnInit} from '@angular/core';
import {CartService} from "../../services/cart.service";
import {CartModelServer} from "../../models/cart.model";
import {Router} from "@angular/router";
import {OrderService} from "../../services/order.service";
import {FormBuilder, NgForm, Validators} from "@angular/forms";
import { productModelServer } from 'src/app/models/product.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartData: CartModelServer= {
    total: 0,
    data: [{
      product:{} as productModelServer,
      numInCart:0,
    }]
  };
  cartTotal: number = 0;
 //showSpinner: boolean;
  checkoutForm: any;
  constructor(private cartService: CartService,
              private orderService: OrderService,
              private router: Router,
              private fb: FormBuilder) {

    this.checkoutForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],

    });


  }

  ngOnInit() {
    this.cartService.cartData$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);

  }

  onCheckout() {
      this.cartService.CheckOutFromCart(2);
    


  //console.log(this.checkoutForm.value);

  }
}