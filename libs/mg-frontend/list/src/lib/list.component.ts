import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Gift {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  link?: string;
}

@Component({
  selector: 'mg-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatTooltipModule,
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  viewMode: 'list' | 'grid' = 'grid';

  gifts: Gift[] = [
    {
      id: 1,
      name: 'Wireless Headphones',
      description:
        'Premium noise-cancelling wireless headphones with 30-hour battery life',
      price: 199.99,
      imageUrl:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D',
    },
    {
      id: 2,
      name: 'Smart Watch',
      description: 'Fitness tracker with heart rate monitor and GPS',
      price: 249.99,
      imageUrl:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
    },
    {
      id: 3,
      name: 'Coffee Maker',
      description: 'Programmable coffee maker with thermal carafe',
      price: 89.99,
      imageUrl:
        'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNvZmZlZSUyMG1ha2VyfGVufDB8fDB8fHww',
    },
    {
      id: 4,
      name: 'Bluetooth Speaker',
      description: 'Portable waterproof speaker with 20-hour battery life',
      price: 129.99,
      imageUrl:
        'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D',
    },
  ];

  toggleViewMode() {
    this.viewMode = this.viewMode === 'list' ? 'grid' : 'list';
  }
}
