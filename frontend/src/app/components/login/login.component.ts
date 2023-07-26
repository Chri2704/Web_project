import { HttpClient } from '@angular/common/http';
import { Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  myForm: FormGroup = new FormGroup({});

  constructor(private http: HttpClient,
              private form : FormBuilder) { }

  ngOnInit(){
    this.myForm = this.form.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  onSubmit() {

    if (this.myForm.valid) {
      const formData = this.myForm.value;

      // Invia i dati al server di Express tramite una richiesta HTTP POST
      this.http.post<any>('http://localhost:3000/api/users/login', formData)
        .subscribe(
          (response: any) => {
            console.log('Registrazione avvenuta con successo!', response);
          },
          (error: any) => {
            console.error('Errore durante la registrazione:', error);
          }
        );
    } else {
      console.log('Il form non è valido');
    }
  }
}
