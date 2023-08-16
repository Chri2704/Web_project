import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import {Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  myForm: FormGroup = new FormGroup({}); //oggetto tipo form group per intercettare le input del form

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit() { 
    //inizializzo il form con i campi vuoti e aggiungo validators 
    this.myForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.validatePasswordMatch });
  }

  // Metodo di validazione incrociata personalizzato
  //catturo la password e il conferma password e confronto che sianouguali altrimenti stampo errore
  validatePasswordMatch(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      group.get('confirmPassword')?.setErrors(null);
      return null;
    }
  }

  //funzione che parte appena premo registrati sul form
  onSubmit() {
    //controllo che sia valido il form
    if (this.myForm.valid) {
      const formData = this.myForm.value;

      // Invia i dati al server di Express tramite una richiesta HTTP POST
      this.http.post<any>('http://localhost:3000/api/users/register', formData)
      //dopo la chiamata al beckend sarà stato registrato l'utente e salvato nel db. dopodichè gestisco l'observable con subscribe e le proprietà observer next e error
        .subscribe({
          // se la risposta non è un errore stampa il messaggio e riporta nella homepage 
          next:(response: any) => {
            console.log('Registrazione avvenuta con successo!', response);
            this.router.navigate(['/login']);
            
          },
          error:(error: any) => {
            console.error('Errore durante la registrazione:', error);
          }
    });
    } else {
      console.log('Il form non è valido');
    }
  }
}
