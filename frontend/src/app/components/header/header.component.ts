import { Component, OnInit } from '@angular/core';
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
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  userData: UserData = { id: 0, username: '', email: '', password: '', role: 0 };

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
              private router: Router,
              private toastr: ToastrService
              ){
                this.cartTotal = 0;
              }
  ngOnInit(): void {
   this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
   this.cartService.cartData$.subscribe(data => this.cartData = data);
   this.checkIsLogged();
  }

  showSuccess() {
    this.toastr.error('Si è verificato un errore!', 'Errore', {
      timeOut: 5000, // Tempo in millisecondi per la durata della notifica (5 secondi)
      progressBar: true, // Mostra una barra di avanzamento
      closeButton: true, // Mostra il pulsante di chiusura
      positionClass: 'toast-top-left', // Posizione della notifica
      extendedTimeOut: 2000, // Tempo extra in millisecondi se l'utente passa il mouse sopra la notifica
      tapToDismiss: false, // Richiede un clic per chiudere la notifica
      enableHtml: true, // Abilita l'uso di HTML nei messaggi
      toastClass: 'toast toast-error', // Classe CSS personalizzata per lo stile della notifica
      titleClass: 'toast-title', // Classe CSS personalizzata per lo stile del titolo
      messageClass: 'toast-message' // Classe CSS personalizzata per lo stile del messaggio
    });
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
  
logout(){
  this.http.get<any>('http://localhost:3000/api/users/logout', { withCredentials: true }).subscribe({
    next:(response) => {
      localStorage.removeItem('cart');
      // Gestisci la risposta qui
      console.log('Risposta:', response);
      window.location.reload();
      window.location.href = "/";
    },
    error:(error) => {
      // Gestisci gli errori qui
      console.error('Errore:', error);
    }
  });
  this.router.navigateByUrl('/', { skipLocationChange: true })
}
}
