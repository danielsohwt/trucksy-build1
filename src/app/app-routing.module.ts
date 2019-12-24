import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthService } from './auth.service'

const routes: Routes = [
  { path: '', redirectTo: 'splashpage', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)},
  { path: 'register',loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)},
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule', canActivate: [AuthService] },
  // { path: 'tabs',loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule), canActivate: [AuthService]},
  {
    path: 'estimateprice/:id',
    loadChildren: () => import('./estimateprice/estimateprice.module').then( m => m.EstimatepricePageModule)
  },
  {
    path: 'booking/:id',
    loadChildren: () => import('./booking/booking.module').then( m => m.BookingPageModule)
  },
  {
    path: 'payment/:id',
    loadChildren: () => import('./payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'confirmation/:id',
    loadChildren: () => import('./confirmation/confirmation.module').then( m => m.ConfirmationPageModule)
  },
  {
    path: 'splashpage',
    loadChildren: () => import('./splashpage/splashpage.module').then( m => m.SplashpagePageModule)
  },
  {
    path: 'admin-orders',
    loadChildren: () => import('./admin-orders/admin-orders.module').then( m => m.AdminOrdersPageModule)
  },
  {
    path: 'admin-order-detail/:id',
    loadChildren: () => import('./admin-order-detail/admin-order-detail.module').then( m => m.AdminOrderDetailPageModule)
  },
  {
    path: 'pages',
    loadChildren: () => import('./dashboard/pages.module')
        .then(m => m.PagesModule),
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
