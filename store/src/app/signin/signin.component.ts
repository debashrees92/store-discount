import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../shared/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signInForm: FormGroup;
  submitted = false;

  errors: boolean = false;
  errorMessage: String = "";
  private querySubscription;

  constructor(private _dataService: DataService, private _route: Router,private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.signInForm = this.formBuilder.group({
      UserName: ['', [Validators.required]],
      Password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.signInForm.controls; }

  onSubmit() {
    this.submitted = true;
  
    // stop here if form is invalid
    if (this.signInForm.invalid) {
        return;
    }else{
  
      this.querySubscription = this._dataService.signIn(this.signInForm.value).subscribe((res) => {
          //console.log(res);    
        if (res["errorCode"] > 0) {
                  this.errors = false;
                  this.errorMessage = "";
                  window.localStorage.setItem('token', res["data"].token);
                  this._route.navigate(['/product']);
              } else {
                  this.errors = true;
                  this.errorMessage =res["errorMessage"];
              }
          });
  
      
    }    
  }
  

}
