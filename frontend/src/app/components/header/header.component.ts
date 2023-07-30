import { Component, OnInit } from '@angular/core';
import { CartModelServer } from 'src/app/models/cart.model';
import { productModelServer } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule, CurrencyPipe  } from '@angular/common';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

responseData:any;

  cartData: CartModelServer = {
    total: 0,
    data: [{
      product:{} as productModelServer,
      numInCart:0,
    }]
  };
  cartTotal: number;
  constructor(public cartService: CartService,
              private http:HttpClient,
              ){
                this.cartTotal = 0;
              }
  ngOnInit(): void {
   this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
   this.cartService.cartData$.subscribe(data => this.cartData = data);
   this.checkIsLogged();
  }

  checkIsLogged() {
    this.http.get<any>('http://localhost:3000/api/users/isLogged', { withCredentials: true }).subscribe({
      next:(response) => {
        // Gestisci la risposta qui
        this.responseData = response
        console.log('Risposta:', response);
      },
      error:(error) => {
        // Gestisci gli errori qui
        console.error('Errore:', error);
      }
    });
  }
  
logout(){
  
}
}
