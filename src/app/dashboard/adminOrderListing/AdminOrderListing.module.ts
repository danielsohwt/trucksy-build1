import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { AdminOrderListingComponent } from './AdminOrderListing.component';

@NgModule({
  imports: [
    NbCardModule,
    ThemeModule,
  ],
  declarations: [
    AdminOrderListingComponent,
  ],
})
export class AdminOrderListingModule { }
