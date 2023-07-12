import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { OrderService } from './order.service';
import { environment } from 'src/environments/environment';
import { CartModelPublic, CartModelServer } from '../models/cart.model';
import { BehaviorSubject } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { productModelServer } from '../models/product.model';


//providedIn root permette di non doverlo aggiungere in provider di app.module.ts

@Injectable({
  providedIn: 'root'
})
export class CartService{

private serverURL = environment.SERVER_URL;

//variabile per conservare le info del cart nello storage locale del client
//in cart.model id viene definito number
private cartDataClient: CartModelPublic = {
  total:0,
  prodData:[{
    inCart: 0,
    id:0
  }]
};

//variabile per conservare le info del cart nello storage locale del server
//in cart model product viene definito productModelServer
private cartDataServer: CartModelServer = {
  total: 0,
  data: [{
    product:{} as productModelServer,
    numInCart:0,
  }]
};

//creazione observable per gestire i flussi di dati asincroni
//behaviorSubject viene fornito da RxJS, in pratica queste variabili emettono l'ultimo valore emesso e lo rendono disponibile alle future subscribe
cartTotal$ = new BehaviorSubject<number>(0); //emette valori aggiornati del totale carrello 
cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);//emette valori aggiornati dei dati del carrello 


  constructor(private http: HttpClient,
                private productService: ProductService,
                private orderService: OrderService,
                private router:Router){
    
        //il metodo next, che appartiene a RxJS, è come un invio di un form dove i dati che prende sono quelli interni al metodo e vengono inviati all'osservatore
        this.cartTotal$.next(this.cartDataServer.total); //emetto nuovo valore del carrello che è contenuto in this.cartDataServer.total
        this.cartData$.next(this.cartDataServer); //aggiorno il contenuto di cartData$ emettendo il valore di cartDataServer

      //prendere le informazioni dallo storage locale (se ce ne sono)
      let info: CartModelPublic = JSON.parse(localStorage.getItem('cart')||'{}');//localStorage.getItem('cart') recupera l'elemento associato alla chiave 'cart' di tipo JSON che viene parsata come oggetto js per salavarla in info
      
          //console.log(info)    //stampa gli elementi nel carrello
            
      //controlla se le info sono nulle o no
      if(info !== null && info !== undefined && info.prodData && info.prodData.length > 0) {
    //if(info !== null && info !== undefined && info.prodData && info.prodData.length > 0 && info.prodData[0].inCart !== 0) {
        //storage locale non vuoto

        this.cartDataClient = info;//vengono inseriti i dati del localstorage

        //console.log(this.cartDataClient.prodData)
        console.log('qui',this.cartDataServer.data[0])

        //ciclo ogni dato e lo insrisco nell'oggetto cartDataServer
        this.cartDataClient.prodData.forEach(p=> {
          //console.log(p, p.id)
        //if (p && p.id) {
          this.productService.getSingleProduct(p.id).subscribe((actualProductInfo : productModelServer)=>{


            if(this.cartDataServer.data[0].numInCart === 0) { //vuol dire che il carrello è vuoto
              this.cartDataServer.data[0].numInCart = p.inCart; //metto il valore del carrello 

              this.cartDataServer.data[0].product = actualProductInfo; //metto i dati del prodotto

              this.CalculateTotal();

              this.cartDataClient.total = this.cartDataServer.total;

              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));

            }else{

//rimozione primo elemento vuoto
              // if(this.cartDataClient.prodData[0].id === 0 ){
              //   this.cartDataClient.prodData.shift();
              //   console.log('qui');
              //   }


              //cartDataServica ha già qualcosa dentro
              this.cartDataServer.data.push({//aggiungo dati 
                numInCart: p.inCart,
                product: actualProductInfo
              });
              this.CalculateTotal();
              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
            }
            this.cartData$.next({...this.cartDataServer});//emetto un nuovo valore in cartData$ al cui interno inserisco una copia di cartDataServer
          });

        // }else{
        //   console.log('p non è definito');
        // }
        });
      }else{
        console.log('Le informazioni del carrello non sono valide o non esistono.');
      }

  }




  //metodo per l'aggiunta nel carrello dei prodotti
  AddProductToCart(id : number, quantity?: number){

    this.productService.getSingleProduct(id).subscribe(prod=>{
      //se carrello vuoto
      console.log('prodotto aggiunto : ',prod)
      console.log('cartDataClient.data 0: ', this.cartDataServer.data[0]);
      
      if(this.cartDataServer.data[0].product === undefined){
        console.log('ao')
        this.cartDataServer.data[0].product = prod;
        console.log('quantity', quantity)
        this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;
        this.CalculateTotal();
        this.cartDataClient.prodData[0].inCart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = prod.id;
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
        this.cartData$.next({...this.cartDataServer});
        //da fare

      }else{//se carrello ha qualcosa
        const index = this.cartDataServer.data.findIndex(p=>p.product.id == prod.id);
        console.log('index',index)
        //se quell'oggetto è già presente nel carrello
        if(index !== -1){
          if(quantity !== undefined && quantity <= prod.quantity){
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity;
          }else {
            console.log('ho aggiunto', this.cartDataServer.data)
            this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart++ : prod.quantity;
          }


                        if(this.cartDataClient.prodData[0].id === 0 ){
                this.cartDataClient.prodData.shift();
                console.log('qui');
          
              }
          
              this.cartDataClient.prodData[index].inCart = this.cartDataServer.data[index].numInCart;

//gli si aggiorna il totale a me non va

              // this.CalculateTotal();
              // this.cartDataClient.total = this.cartDataClient.total;
          localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
          //to do
        }else{
          this.cartDataServer.data.push({
            numInCart: 1,
            product: prod
          });

          this.cartDataClient.prodData.push({
            inCart: 1,
            id: prod.id,
          });
                        this.CalculateTotal();
              this.cartDataClient.total = this.cartDataClient.total;
          localStorage.setItem('cart',JSON.stringify(this.cartDataClient));

          //to do
          this.CalculateTotal();
          this.cartDataClient.total = this.cartDataClient.total; //aggiorno il totale
          localStorage.setItem('cart',JSON.stringify(this.cartDataClient)); //setto il localStorage cart con i dati di cartDataClient
          this.cartData$.next({...this.cartDataServer});

        } //fine else



      }

    });



  }

  UpdateCartItems(index: number, increase: boolean ){
    let data = this.cartDataServer.data[index];

    if(increase){
      data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity;
      this.cartDataClient.prodData[index].inCart = data.numInCart;
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      this.cartData$.next({...this.cartDataServer});
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartData$.next({...this.cartDataServer});
    }else{
      data.numInCart--;

      if(data.numInCart<1){
        //cancellare prodotti carrello
        this.DeleteProductFromCart(index);
        this.cartData$.next({...this.cartDataServer});
      }else{
        this.cartData$.next({...this.cartDataServer});
        this.cartDataClient.prodData[index].inCart = data.numInCart;
        this.CalculateTotal();

        this.cartDataClient.total = this.cartDataServer.total;

        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
    }
  }

  CalculateSubTotal(index: number): number {
    let subTotal = 0;

    let p = this.cartDataServer.data[index];
    // @ts-ignore
    subTotal = p.product.price * p.numInCart;

    return subTotal;
  }

  DeleteProductFromCart(index:number){
    if(window.confirm('Sicuro di voler rimuovere il prodotto?')){
      this.cartDataServer.data.splice(index,1);
      this.cartDataClient.prodData.splice(index,1);
      this.CalculateTotal();

      this.cartDataClient.total = this.cartDataServer.total;

      if(this.cartDataClient.total === 0){
        this.cartDataClient = {total:0,prodData:[{inCart: 0,id:0}]};
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }else{
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

      if(this.cartDataServer.total === 0){
        this.cartDataServer = {total: 0,data: [{numInCart:0,product:{} as productModelServer}]};
        this.cartData$.next({...this.cartDataServer});
      }else{
        this.cartData$.next({...this.cartDataServer});
      }
    }else{
      //se l'utente clicca su cancella
      return;
    }
  }

  // per ogni elemento di cartDataServer faccio la destructuring delle variabili, li inserisco in totale e poi lo aggiorno. infine emetto in cartTotal nuovo totale
  private CalculateTotal(){
    let total = 0;
    this.cartDataServer.data.forEach(p=>{
      const {numInCart} = p;
      const {price} = p.product;

      total += numInCart * price;
    });
    this.cartDataServer.total = total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

  calculateSubTotal(index: number):number{
    let subTotal = 0;

    const p = this.cartDataServer.data[index];
    subTotal= p.product.price + p.numInCart;
    
    return subTotal;
  }


  CheckOutFromCart(userId: number){
    this.http.post<OrderResponse>(`${this.serverURL}orders/payment`, null).subscribe((res:{success : boolean}) =>{

      if(res.success){
        this.resetServerData();
        this.http.post<OrderResponse>(`${this.serverURL}orders/new`, {
          userId: userId,
          products: this.cartDataClient.prodData
        }).subscribe((data: OrderResponse) => {

          this.orderService.getSingleOrder(data.order_id).then(prods =>{
            if(data.success){
              const navigationExtras : NavigationExtras = {
                state: {
                  message: data.message,
                  products: prods,
                  orderId: data.order_id,
                  total: this.cartDataClient.total
                }
              };
              
              //to do
              this.router.navigate(['/thankyou'], navigationExtras).then(p=>{
                this.cartDataClient = {total:0, prodData: [{inCart: 0, id: 0}]};
                this.cartTotal$.next(0);
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));

              });
            }
            
          });

        });
      }
    });
    }
  

    private resetServerData(){
      this.cartDataServer = {
        total: 0,
        data: [{
          numInCart:0,
          product:{} as productModelServer,
        }]
      };

      this.cartData$.next({...this.cartDataServer});
    }



}

interface OrderResponse{
  order_id: number;
  success: boolean;
  message : string;
  products: [{
    id:string,
    numInCart: string
  }];
}