
//interfaccia che permette di prendere gli elementi del server, in questo caso oggetti che rappresentano i prodotti
export interface productModelServer{
    id: number;
    name: string;
    category: string;
    description: string;
    image: string;
    price: number;
    quantity: number;
    images: string;
}


//interfaccia che prende la get del server, viene richiamata in prodct.service per definire il type delle funzioni
export interface ServerResponse{
    count: number;
    products: productModelServer[];
};