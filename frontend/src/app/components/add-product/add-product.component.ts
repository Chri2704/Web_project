import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  myForm: FormGroup = new FormGroup({}); //oggetto tipo form group per intercettare le input del form

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit() { 
    //inizializzo il form con i campi vuoti e aggiungo validators 
    this.myForm = this.formBuilder.group({
      image: ['', [Validators.required]],
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]], // Campo quantità, obbligatorio e deve essere un numero positivo
      description: ['', Validators.required], 
    });
  }

  onSubmit(){
    //controllo che sia valido il form
    if (this.myForm.valid) {
      const formData = this.myForm.value;

      // Invia i dati al server di Express tramite una richiesta HTTP POST
      this.http.post<any>('http://localhost:3000/api/products/add_product', formData)
      //dopo la chiamata al beckend sarà stato registrato l'utente e salvato nel db. dopodichè gestisco l'observable con subscribe e le proprietà observer next e error
        .subscribe({
          // se la risposta non è un errore stampa il messaggio e riporta nella homepage 
          next:(response: any) => {
            console.log('Inserimento avvenuto con successo!', response);
            this.router.navigate(['/dashboard']);
            
          },
          error:(error: any) => {
            console.error('Errore durante l\'inserimento:', error);
          }
    });
    } else {
      console.log('Il form non è valido');
    }
  }

}
