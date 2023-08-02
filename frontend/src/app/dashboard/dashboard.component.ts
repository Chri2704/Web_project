import { HttpClient } from '@angular/common/http';
import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  
  users: any[] = [];

  constructor(private http: HttpClient,
    private router: Router) { }
  
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

}
