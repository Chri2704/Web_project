import { HttpClient } from '@angular/common/http';
import { Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule  } from '@angular/forms';
import { Router } from '@angular/router';
import { productModelServer } from '../models/product.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  
  users: any[] = [];
  orders: any[] = [];
  products: productModelServer[] = [];
  editProductId: number | null = null;
  editForm: FormGroup;
  productEdit: productModelServer[] = [];


  constructor(private http: HttpClient,
    private router: Router,
    private fb: FormBuilder) { 
      this.editForm = this.fb.group({
        id: [''],
        image: [''],
        name: [''],
        category: [''],
        price: [''],
        quantity: [''], // Campo quantità, obbligatorio e deve essere un numero positivo
        description: [''], 
      });
    }
  
    ngOnInit(): void {
      // Effettua la richiesta GET all'endpoint del server
      this.http.get<any>('http://localhost:3000/api/users/getAll') // Assumi che il tuo server sia in ascolto su localhost:3000
        .subscribe({
          next: (response: any) => {
            // Gestisci la risposta qui
            this.users = response.userData; // Salva i dati degli utenti nella variabile users
            console.log('Dati utenti:', this.users);
          },
          error: (error: any) => {
            // Gestisci gli errori qui
            console.error('Errore durante la richiesta:', error);
          }
        });


              this.http.get<any>('http://localhost:3000/api/orders/getAllOrders') // Assumi che il tuo server sia in ascolto su localhost:3000
        .subscribe({
          next: (response: any) => {
            // Gestisci la risposta qui
            this.orders = response.ordersData; // Salva i dati degli utenti nella variabile oorders
            console.log('Dati ordini:', this.orders);
          },
          error: (error: any) => {
            // Gestisci gli errori qui
            console.error('Errore durante la richiesta:', error);
          }
        });

        this.http.get<any>('http://localhost:3000/api/products') // Assumi che il tuo server sia in ascolto su localhost:3000
        .subscribe({
          next: (response: any) => {
            // Gestisci la risposta qui
            this.products = response.products; // Salva i dati degli utenti nella variabile users
            console.log('Dati prodotti:', this.products);
          },
          error: (error: any) => {
            // Gestisci gli errori qui
            console.error('Errore durante la richiesta:', error);
          }
        });


    }

    modifyProducts(id:number){
        // Trova il prodotto con l'ID specifico
      const productToEdit = this.products.find(product => product.id === id);

      if (productToEdit) {
        // Attiva la modalità di modifica per il prodotto trovato
        productToEdit.editMode = true;
      }
      // Crea una copia dei dati del prodotto per verificarne le modifiche in seguito
    }

    saveChanges(product: productModelServer){
      // Verifica se il form è valido prima di procedere    
      // this.editForm.patchValue({
      //   id:product.id,
      //   image:product.image,
      //   name: product.name,
      //   category: product.category,
      //   price: product.price,
      //   quantity: product.quantity,
      //   description: product.description,
      // // Aggiungi altri campi del form se necessario
      // });
      console.log("nome prodotto",product.name)
      this.editForm.value.name = product.name;
      this.editForm.value.id = product.id;
      this.editForm.value.image = product.image;
      this.editForm.value.category = product.category;
      this.editForm.value.price = product.price;
      this.editForm.value.quantity = product.quantity;
      this.editForm.value.description = product.description;
      

      console.log(this.editForm)
      if (this.editForm.valid) {
    
        this.http.post<any>('http://localhost:3000/api/products/refresh_product', this.editForm.value)
          .subscribe({
            // se la risposta non è un errore stampa il messaggio e riporta nella homepage 
            next:(response: any) => {
              console.log('Aggiornamento avvenuto con successo!', response);
              this.router.navigate(['/dashboard']);
              
            },
            error:(error: any) => {
              console.error('Errore durante l\'aggiornamento:', error);
            }
        });
        // Aggiorna i dati del prodotto nel tuo array o invia al backend per l'aggiornamento
        // Utilizza this.editForm.value per ottenere i dati aggiornati

        // Disattiva la modalità di modifica dopo l'aggiornamento
        product.editMode = false;

        // Reimposta il form ai valori predefiniti
        this.editForm.reset();
      }else{
        console.log("error")
      }
    }

      cancelEdit(product: productModelServer) {
        // Annulla la modalità di modifica e reimposta il form ai valori predefiniti
        product.editMode = false;
        this.editForm.reset();
      }
    

    deleteUser(id: number){
      const result = window.confirm('Sei sicuro di voler eliminare questo utente?');

      if(result){
        this.http.post('http://localhost:3000/api/users/delete', { id: id }).subscribe({ //devo passare l'id in formato json
          next: (response: any) => {
            // Gestisci la risposta qui
            window.location.reload();
          },
          error: (error: any) => {
            // Gestisci gli errori qui
            console.error('Errore durante la richiesta:', error);
          }
        })
      }else{
        console.log('hai premuto annulla');
      }
    }


        deleteOrders(id: number){
      const result = window.confirm('Sei sicuro di voler eliminare questo elemento dell\'ordine?');

      if(result){
        this.http.post('http://localhost:3000/api/orders/delete', { id: id }).subscribe({ //devo passare l'id in formato json
          next: (response: any) => {
            // Gestisci la risposta qui
            window.location.reload();
          },
          error: (error: any) => {
            // Gestisci gli errori qui
            console.error('Errore durante la richiesta:', error);
          }
        })
      }else{
        console.log('hai premuto annulla');
      }
    }


    deleteProducts(id: number){
      const result = window.confirm('Sei sicuro di voler eliminare questo prodotto?');

      if(result){
        this.http.post('http://localhost:3000/api/products/delete', { id: id }).subscribe({ //devo passare l'id in formato json
          next: (response: any) => {
            // Gestisci la risposta qui
            window.location.reload();
          },
          error: (error: any) => {
            // Gestisci gli errori qui
            console.error('Errore durante la richiesta:', error);
          }
        })
      }else{
        console.log('hai premuto annulla');
      }
    }

}
