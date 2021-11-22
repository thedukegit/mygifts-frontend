import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mg-gifts',
  templateUrl: './gifts.component.html',
  styleUrls: ['./gifts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiftsComponent implements OnInit {

  public ngOnInit(): void {
  }

}
