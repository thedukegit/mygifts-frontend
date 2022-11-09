import { Component, OnInit } from '@angular/core';
import { Gift, GiftGateway } from '@mygifts/desktop/gifts/domain';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'mg-gifts',
  templateUrl: './gifts.component.html',
  styleUrls: ['./gifts.component.scss'],
})
export class GiftsComponent implements OnInit {
  public gifts: Gift[] = [];
  public sortField = 'name';
  public sortOrder = 1;
  sortOptions: any;
  sortKey: any;

  public constructor(private readonly giftGateway: GiftGateway) {}

  public ngOnInit(): void {
    this.loadGifts();
  }

  public onSortChange(event: any) {
    console.log(event);
  }

  public loadGifts(): void {
    this.giftGateway
      .getWithQuery()
      .pipe(filter((gifts) => !!gifts))
      .subscribe((gifts) => {
        this.gifts = gifts;
      });
  }
}
