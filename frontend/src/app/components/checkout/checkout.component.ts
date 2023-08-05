import {Component, OnInit} from '@angular/core';
import {CartService} from "../../services/cart.service";
import {CartModelServer} from "../../models/cart.model";
import {Router} from "@angular/router";
import {OrderService} from "../../services/order.service";
import {FormBuilder, NgForm, Validators} from "@angular/forms";
import { productModelServer } from 'src/app/models/product.model';
import { HttpClient } from '@angular/common/http';


interface UserData {
  id: number;
  username: string;
  password: string;
  email: string;
  role: number;
  // E altri campi che possono essere presenti
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  responseData:any;
  userData: UserData = { id: 0, username: '', email: '', password: '', role: 0 };
  idUtente: number = 0;

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
              private fb: FormBuilder,
              private http:HttpClient) {

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
    this.checkIsLogged();
  }

  onCheckout() {
    this.cartService.CheckOutFromCart(this.idUtente);
  }

  

  checkIsLogged(){
    this.http.get<any>('http://localhost:3000/api/users/isLogged', { withCredentials: true }).subscribe({
      next: (response) => {
        // Gestisci la risposta qui
        this.responseData = response;
        
        // Controlla se "userExist" è presente nella risposta
        if (response.userExist) {
          this.userData = {
            id: response.userExist.id,
            username: response.userExist.username,
            email: response.userExist.email,
            password:response.userExist.password,
            role: response.userExist.role
            // E altri campi che potrebbero essere necessari
          };
          console.log('Dati utente:', this.userData.id);
          this.idUtente = this.userData.id;

        }
      },
    });

  }


}