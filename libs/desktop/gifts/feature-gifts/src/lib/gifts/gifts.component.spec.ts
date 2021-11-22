import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftsComponent } from './gifts.component';
import { By } from '@angular/platform-browser';

describe('GiftsComponent', () => {
  let component: GiftsComponent;
  let fixture: ComponentFixture<GiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiftsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a gift', ()=>{
    // arrange
    const giftElement = fixture.debugElement.query(By.css('mg-gift'));

    // act

    // assert
    expect(giftElement).toBeTruthy();
  })
});
