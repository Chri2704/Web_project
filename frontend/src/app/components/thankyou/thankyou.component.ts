import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent {
  message: string ='';
  orderId: number = 0;
  products: any[] = [];
  cartTotal: number = 0;
  constructor(private router: Router,
              private orderService: OrderService) {
    const navigation = this.router.getCurrentNavigation();
    if(navigation){
          const state = navigation.extras.state as {
        message: string,
        products: ProductResponseModel[],
        orderId: number,
        total: number
      }; 
    
        this.message = state.message;
    this.orderId = state.orderId;
    this.products = state.products;
    this.cartTotal = state.total;
    console.log(this.products);
    
    }else{
      console.log(' in thankyou component navgation è null probabilmente')
    }
 


  }

  ngOnInit() {

  }

}

interface ProductResponseModel {
  id: number;
  title: string;
  description: string;
  price: number;
  quantityOrdered: number;
  image: string;
}

