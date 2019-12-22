import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminOrderDetailPage } from './admin-order-detail.page';

describe('AdminOrderDetailPage', () => {
  let component: AdminOrderDetailPage;
  let fixture: ComponentFixture<AdminOrderDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOrderDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminOrderDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
