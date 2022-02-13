import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthComponent } from './auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthComponent],
      imports: [FormsModule, ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loginForm', () => {
    it('should successfully log user in', () => {
      throw new Error('test needs work');
      // arrange
      const username = 'peter';
      const password = '123';
      const usernameEl = fixture.debugElement.query(
        By.css('#username')
      ).nativeElement;
      const passwordEl = fixture.debugElement.query(
        By.css('#password')
      ).nativeElement;
      const submitEl = fixture.debugElement.query(By.css('button'));
      const onSubmitSpy = jest.spyOn(component, 'onSubmit');
      // act
      usernameEl.value = username;
      passwordEl.value = password;
      usernameEl.dispatchEvent(new Event('input'));
      passwordEl.dispatchEvent(new Event('input'));
      // console.log(usernameEl.value);
      // console.log(passwordEl.value);
      fixture.detectChanges();
      submitEl.triggerEventHandler('click', null);

      // assert
      expect(onSubmitSpy).toHaveBeenCalled();
    });
  });
});
