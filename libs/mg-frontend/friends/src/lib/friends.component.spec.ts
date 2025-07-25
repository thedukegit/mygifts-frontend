import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FRIEND_REPOSITORY } from './friend-repository.token';
import { FriendsComponent } from './friends.component';
import { IndexedDbFriendRepository } from './repositories/indexed-db-friend-repository';

describe('FriendsComponent', () => {
  let component: FriendsComponent;
  let fixture: ComponentFixture<FriendsComponent>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;
  let mockFriendRepository: IndexedDbFriendRepository;

  beforeEach(async () => {
    mockSnackBar = { open: jest.fn() } as unknown as jest.Mocked<MatSnackBar>;    
    mockFriendRepository = new IndexedDbFriendRepository();

    await TestBed.configureTestingModule({
      imports: [FriendsComponent],
      providers: [
        { provide: FRIEND_REPOSITORY, useValue: mockFriendRepository },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
