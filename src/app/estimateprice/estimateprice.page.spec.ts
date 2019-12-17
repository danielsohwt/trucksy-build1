import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EstimatepricePage } from './estimateprice.page';

describe('EstimatepricePage', () => {
  let component: EstimatepricePage;
  let fixture: ComponentFixture<EstimatepricePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstimatepricePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EstimatepricePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
