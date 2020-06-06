import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  items = [];
  constructor(private _http: HttpClient) { }
  signIn(formData){
  //console.log("formdata===="+formData);
    let token = localStorage.getItem('token') ? localStorage.getItem('token') : "abcd";  
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'token': token }) };
  	return this._http.post("http://localhost:3000/signIn", formData, httpOptions);
  }
  getProductData(){
    let token = localStorage.getItem('token') ? localStorage.getItem('token') : "abcd";  
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'token': token }) };
    return this._http.get("http://localhost:3000/getProductData", httpOptions);
  }
  getUserData(){
    let token = localStorage.getItem('token') ? localStorage.getItem('token') : "abcd";  
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'token': token }) };
    return this._http.get("http://localhost:3000/getUser", httpOptions);
  }
  sendMessage(data) {
    console.log("dataget====="+data);
    this.items.push(data);
  }
  getMessage() {
    console.log('items==='+ this.items);
    return this.items;
  }

}
