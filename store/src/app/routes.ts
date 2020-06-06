import { Routes } from '@angular/router';

//componenet
import { SigninComponent } from './signin/signin.component';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';

//services
import { AuthGuardService } from './shared/auth-guard.service';

export const appRoutes : Routes = [
{ path:'' , redirectTo: '/signin',pathMatch: 'full'},
{ path: 'signin', component: SigninComponent },
{ path: 'product', component: ProductComponent ,canActivate: [AuthGuardService]},
{ path: 'cart', component: CartComponent ,canActivate: [AuthGuardService]}
];