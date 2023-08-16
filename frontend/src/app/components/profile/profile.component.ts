import { Component } from '@angular/core';
import { CartModelServer } from 'src/app/models/cart.model';
import { productModelServer } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule, CurrencyPipe  } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface UserData {
  id: number;
  username: string;
  password: string;
  email: string;
  role: number;
  // E altri campi che possono essere presenti
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userData: UserData = { id: 0, username: '', email: '', password: '', role: 0 };

  responseData:any;

  constructor(public cartService: CartService,
    private http:HttpClient,
    private router: Router,
    private toastr: ToastrService
    ){

    }
ngOnInit(): void {

this.checkIsLogged();
}

  checkIsLogged() {
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
          console.log('Dati utente:', this.userData);
        } else {
          console.log('Utente non esiste');
        }
      },
      error: (error) => {
        // Gestisci gli errori qui
        console.error('token:', error);
      }
    });
  }
}
