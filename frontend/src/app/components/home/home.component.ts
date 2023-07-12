import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServerResponse, productModelServer } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {


  products: productModelServer[] =[];

  constructor(private productService: ProductService,
              private cartService: CartService,
              private router: Router){}

  ngOnInit(): void{
    this.productService.getAllProducts().subscribe((prods:ServerResponse)=>{
      this.products = prods.products;
      //console.log(this.products) //stampa i prodotti che sono nella prima pagina
    });
  }
  selectProduct(id:Number){
    this.router.navigate(['/product', id])
    .then();
  }


  AddProduct(id: number) {
    this.cartService.AddProductToCart(id);
  }

}
