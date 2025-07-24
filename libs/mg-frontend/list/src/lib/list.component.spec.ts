import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GIFT_REPOSITORY } from './gift-repository.token';
import { ListComponent } from './list.component';
import { InMemoryGiftRepository } from './repositories/in-memory-gift.repository';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;
  let giftRepository: InMemoryGiftRepository;

  beforeEach( () => {
    mockDialog = { open: jest.fn() } as any;
    mockSnackBar = { open: jest.fn() } as any;    
    giftRepository = new InMemoryGiftRepository();

     TestBed.configureTestingModule({
      imports: [
        ListComponent,
      ],
      providers: [
        { provide: GIFT_REPOSITORY, useValue: giftRepository },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
