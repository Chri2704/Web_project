import { Component, OnInit } from '@angular/core';
import { CartModelServer } from 'src/app/models/cart.model';
import { productModelServer } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {

  cartData : CartModelServer= {
    total: 0,
    data: [{
      product:{} as productModelServer,
      numInCart:0,
    }]
  };
  cartTotal : number = 0;
  subTotal : number = 0;

  constructor(public cartService: CartService){

  }

  ngOnInit(){
    this.cartService.cartData$.subscribe((data: CartModelServer) => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);


  }
  ChangeQuantity(id: number, increaseQuantity: boolean) {
    this.cartService.UpdateCartItems(id, increaseQuantity);
  }

}
