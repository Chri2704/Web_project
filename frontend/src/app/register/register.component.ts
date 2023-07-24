import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  myForm: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      passwor: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.validatePasswordMatch });
  }

  // Metodo di validazione incrociata personalizzato
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

  onSubmit() {

    if (this.myForm.valid) {
      const formData = this.myForm.value;

      // Invia i dati al server di Express tramite una richiesta HTTP POST
      this.http.post<any>('http://localhost:3000/api/users/register', formData)
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
