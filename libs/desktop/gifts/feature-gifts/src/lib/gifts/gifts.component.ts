import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'mg-gifts',
  templateUrl: './gifts.component.html',
  styleUrls: ['./gifts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GiftsComponent implements OnInit {
  public gifts = [];
  public sortField = 'name';
  public sortOrder = 1;
  sortOptions: any;
  sortKey: any;

  public ngOnInit(): void {}

  onSortChange(event: any) {
    console.log(event);
  }
}
