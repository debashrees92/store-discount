import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../shared/data.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  private querySubscription;
  docData = [];
  error: boolean = false;
  errorMessage: String = "";
  // success: boolean = false;
  // successMessage: String = "";

  constructor(private _route: Router, private _dataService: DataService, 
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getData();
  }
  getData(){
    this.querySubscription = this._dataService.getProductData().subscribe((res) => {
      if (res["errorCode"] > 0) {
          this.error = false;
          this.errorMessage = "";
          this.docData = res["data"];
      } else {
          this.error = true;
          this.errorMessage = res["errorMessage"];
      }
    },
      (error) => {
          this.error = true;
          this.errorMessage = error.message;
      }
    );
  }
  handleAddToCart(docDatas,element,text){
    docDatas.Quantity = 1;
    this._dataService.sendMessage(docDatas);
    element.textContent = text;
    element.disabled = true;
  }
  Logout() {
    localStorage.removeItem('token');
    this._route.navigate(['/signin']);
  }

}
