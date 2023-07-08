import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServerResponse, productModelServer } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {


  products: productModelServer[] =[];

  constructor(private productService: ProductService,
              private router: Router){}

  ngOnInit(): void{
    this.productService.getAllProducts().subscribe((prods:ServerResponse)=>{
      this.products = prods.products;
      console.log(this.products)
    });
  }
  selectProduct(id:Number){
    this.router.navigate(['/product', id])
    .then();
  }
}
