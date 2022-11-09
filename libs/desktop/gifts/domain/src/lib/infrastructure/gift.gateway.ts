import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Gift } from '../entities/gift.interface';
import { map } from 'rxjs/operators';
import { DocumentsInterface } from './documents.interface';

@Injectable({
  providedIn: 'root',
})
export class GiftGateway {
  private firebaseProjectId = 'mygifts-faf66';
  private baseUrl = `https://${this.firebaseProjectId}-default-rtdb.europe-west1.firebasedatabase.app/`;
  private giftsResource = `${this.baseUrl}/gifts.json`;

  public constructor(private readonly httpClient: HttpClient) {}

  public getWithQuery(): Observable<Gift[]> {
    return this.httpClient
      .get<DocumentsInterface<Gift>>(this.giftsResource)
      .pipe(
        map((response) => {
          const gifts: Gift[] = [];
          for (const key in response) {
            gifts.push({ ...response[key], id: key });
          }
          return gifts;
        })
      );
  }
}
