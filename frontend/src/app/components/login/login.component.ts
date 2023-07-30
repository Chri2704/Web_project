import { HttpClient } from '@angular/common/http';
import { Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

//commenti uguali in register.component.ts
export class LoginComponent {

  myForm: FormGroup = new FormGroup({});

  constructor(private http: HttpClient,
              private form : FormBuilder,
              private router: Router) { }

  ngOnInit(){
    this.myForm = this.form.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
    });
  }



  //submit form
  onSubmit() {
    console.log(this.myForm)

    if (this.myForm.valid) {
      const formData = this.myForm.value;
    console.log(this.myForm.value)

      // Invia i dati al server di Express tramite una richiesta HTTP POST
      let res = this.http.post<any>('http://localhost:3000/api/users/login', formData, {withCredentials:true})
        .subscribe({
          next : (response: any) => {
            console.log('login avvenuto con successo!', response);
            this.router.navigate(['/']);
          },
          error : (error: any) => {
            console.error('Errore durante il:', error);
          }
        });
    } else {
      console.log('Il form non è valido');
    }
  }
}
