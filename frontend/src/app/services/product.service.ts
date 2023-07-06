import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {Observable} from "rxjs";
import { ServerResponse, productModelServer } from '../models/product.model';


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
  //è stato necessario definire il tipo di ritorno Observable<ServerResponse> alla funzione altrimenti problemi di overload dato che ci si aspettano 2 tipi di dato
  getAllProducts(numberOfResults=10):Observable<ServerResponse>{
    return this.http.get<ServerResponse>(this.SERVER_URL + '/products',{
      params:{
        limit: numberOfResults.toString()
      }
    });
  }

  getSingleProduct(id: Number): Observable<productModelServer> {
    return this.http.get<productModelServer>(this.SERVER_URL + 'products/' + id);
  }

  getProductsFromCategory(catName: String): Observable<productModelServer[]> {
    return this.http.get<productModelServer[]>(this.SERVER_URL + 'products/category/' + catName);
  }

}
