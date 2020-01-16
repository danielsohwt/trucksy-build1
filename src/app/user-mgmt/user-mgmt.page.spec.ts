import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserMgmtPage } from './user-mgmt.page';

describe('UserMgmtPage', () => {
  let component: UserMgmtPage;
  let fixture: ComponentFixture<UserMgmtPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMgmtPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserMgmtPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
