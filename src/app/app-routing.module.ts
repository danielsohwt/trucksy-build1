import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)},
  { path: 'register',loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)},
  { path: 'tabs',loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)},
  {
    path: 'estimateprice',
    loadChildren: () => import('./estimateprice/estimateprice.module').then( m => m.EstimatepricePageModule)
  },
  {
    path: 'booking',
    loadChildren: () => import('./booking/booking.module').then( m => m.BookingPageModule)
  },
//   {
//     path: 'dashboard',
//     loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
//   }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
