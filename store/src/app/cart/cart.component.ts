import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import { FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartSubTotal = 0;
  totalTax = 0;
  //taxPer = 0.05;
  cartTotal = 0;
  discTotal = 0;
  discFlat = 0;
  discEmp = 0;
  discAffi = 0;
  discDate = 0

  private querySubscription;
  error: boolean = false;
  success: boolean = false;
  errorMessage: String = "";
  successMessage: String = ""; 
  userData: any = {};
  productData = [];
  discount = [30,10,5,5];
  UserType = 1;
  UserDate: any = "";
  oldDate: any = "";
  
  constructor(private _dataService: DataService, private formBuilder: FormBuilder, private _route: Router) { }
  

  ngOnInit() {
    this.productData = this._dataService.getMessage();
    this.getUserData();
  }
  getUserData(){
    this.querySubscription = this._dataService.getUserData().subscribe((res) => {
      if (res["errorCode"] > 0) {
          this.error = false;
          this.errorMessage = "";
          this.userData = res["data"];
          this.UserType = res["data"].UserType;
          this.UserDate = res["data"].AddedDate;
          this.oldDate = this.calDates(new Date(), 2).toUTCString();
          this.oldDate = Date.parse(this.oldDate);
          this.refreshCart(this.productData);
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
  handleUpdateCart(Id,Qty){
    for (var i in this.productData){
      if(this.productData[i].Id === Id){
        this.productData[i].Quantity = Qty;
      }
    }
    this.refreshCart(this.productData);
  }
  refreshCart(data){
    console.log("type----"+this.UserType);
    this.cartSubTotal = 0;
    this.cartTotal = 0;
    this.discTotal = 0;
    this.discFlat = 0;
    this.discEmp = 0;
    this.discAffi = 0;
    this.discDate = 0
    data.forEach(element => {
      this.cartSubTotal += (element.Price * element.Quantity)
    });
    if(this.cartSubTotal >= 100){
      this.discFlat = this.calulateDiscount(this.cartSubTotal,'flat');
      if(this.UserType === 2 ) this.discEmp = this.calulateDiscount(this.cartSubTotal,'employee');
      if(this.UserType === 3 ) this.discAffi = this.calulateDiscount(this.cartSubTotal,'affiliate');
      //---date check
      //console.log("___Date___"+ this.oldDate+"____"+new Date(this.UserDate).toString()); 
      if(this.oldDate >= Date.parse(this.UserDate) ) {
        console.log("innnn");
        this.discDate = this.calulateDiscount(this.cartSubTotal,'oldCustomer');
      }
      console.log(this.discFlat+"____"+this.discEmp+"____"+this.discAffi+"____"+this.discDate); 
      console.log(Math.max(this.discFlat,this.discEmp,this.discAffi,this.discDate)); 
      this.discTotal = Math.max(this.discFlat,this.discEmp,this.discAffi,this.discDate);
      //console.log("typelog--"+this.userData.UserType)
      this.cartTotal = this.cartSubTotal - this.discTotal;
    }else{
      if(this.UserType === 2 ) this.discEmp = this.calulateDiscount(this.cartSubTotal,'employee');
      if(this.UserType === 3 ) this.discAffi = this.calulateDiscount(this.cartSubTotal,'affiliate');
      //---date Check
      if(this.oldDate >= Date.parse(this.UserDate) ) {
        this.discDate = this.calulateDiscount(this.cartSubTotal,'oldCustomer');
      }
      console.log(this.discFlat+"____"+this.discEmp+"____"+this.discAffi+"____"+this.discDate); 
      console.log(Math.max(this.discEmp,this.discAffi,this.discDate)); 
      this.discTotal = Math.max(this.discEmp,this.discAffi,this.discDate);
      this.cartTotal = this.cartSubTotal - this.discTotal;
    }
  }
  calulateDiscount(total,discountType){
    if(discountType == 'flat'){
      var floor =  Math.floor(total/100); 
      return floor * 5;
    }
    //30% discount
    if(discountType == 'employee'){
      return total*0.3;
    }
    //10% discount
    if(discountType == 'affiliate'){
      return total*0.1;
    }
    //5% discount
    if(discountType == 'oldCustomer'){
      return total*0.05;
    }
    
  }
  calDates(dt,n){
 	  return new Date(dt.setFullYear(dt.getFullYear() - n));      
  }
  Logout() {
    localStorage.removeItem('token');
    this._route.navigate(['/signin']);
  }
  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }

  }

}
