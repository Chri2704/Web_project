import { productModelServer } from "./product.model";

//interfaccia per definire i dati del server e tipizzare per gestire meglio gli errori

export interface CartModelServer{
    total : number; //totale carrello
    data: [{        //oggetto che riporta i prodotti del carrello e il numero formato array
        product: productModelServer,
        numInCart: number
    }];
}

export interface CartModelPublic{ //definisce struttura dei dati lato client
    total : number;
    prodData:[{
        id:number,
        inCart: number,
    }];
}