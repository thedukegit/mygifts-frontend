import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mygifts-gifts',
  templateUrl: './gifts.component.html',
  styleUrls: ['./gifts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiftsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
