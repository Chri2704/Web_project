import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {


  products: any[] =[];

  constructor(private productService: ProductService,
              private router: Router){}

  ngOnInit(): void{
    this.productService.getAllProducts().subscribe((prods:any)=>{
      this.products = prods.products;
      console.log(this.products)
    });
  }
  selectProduct(id:Number){
    this.router.navigate(['/product', id])
    .then();
  }
}
