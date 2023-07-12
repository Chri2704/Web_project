import { Component, OnInit } from '@angular/core';
import { CartModelServer } from 'src/app/models/cart.model';
import { productModelServer } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  cartData: CartModelServer = {
    total: 0,
    data: [{
      product:{} as productModelServer,
      numInCart:0,
    }]
  };
  cartTotal: number;
  constructor(public cartService: CartService,
              ){
                this.cartTotal = 0;
              }
  ngOnInit(): void {
   this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
   this.cartService.cartData$.subscribe(data => this.cartData = data);
  }

}
