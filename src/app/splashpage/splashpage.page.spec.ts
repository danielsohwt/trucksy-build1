import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SplashpagePage } from './splashpage.page';

describe('SplashpagePage', () => {
  let component: SplashpagePage;
  let fixture: ComponentFixture<SplashpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplashpagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SplashpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
