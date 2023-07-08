import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { NumberSymbol } from '@angular/common';
import { environment } from 'src/environments/environment';


//providedIn root permette di non doverlo aggiungere in provider di app.module.ts

@Injectable({
  providedIn: 'root'
})
export class OrderService{

    products: any[] =  [];
    private server_url = environment.SERVER_URL;

    constructor(private http: HttpClient){
       
    }
    getSingleOrder(orderId: number){
        return this.http.get<ProductResponseModel[]>(this.server_url + '/orders' +orderId).toPromise(); //converte l'observable in una promessa
    }
}


interface ProductResponseModel{
    id: number;
    title: string;
    description: string;
    price: number;
    quantityOrdered: number;
    image: string;
}