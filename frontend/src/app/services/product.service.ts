import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

//providedIn root permette di non doverlo aggiungere in provider di app.module.ts
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  //recupero dal file environment l'url server per collegarmi al backend
  private SERVER_URL = environment.SERVER_URL;

  //Router permette lo spostamento tra diverse route
  constructor(private http: HttpClient) { }

  //prende tutti i prodotti del backend usando la chiamata http GET sull' indirizzo /api/products che recupera tutti i prodotti dal db
  getAllProducts(numberOfResults=10){
    return this.http.get(this.SERVER_URL + '/products',{
      params:{
        limit: numberOfResults.toString()
      }
    });
  }

}
