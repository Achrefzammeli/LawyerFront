import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { Pack } from '../models/pack';
import { Paiement } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class UserSubscriptionService extends BaseService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    super();
  }

  getUserSubscriptions(userId: number): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}/users/${userId}/subscriptions`, {
      headers: this.getAuthHeaders()
    });
  }

  getActiveSubscription(userId: number): Observable<Paiement> {
    return this.http.get<Paiement>(`${this.apiUrl}/users/${userId}/active-subscription`, {
      headers: this.getAuthHeaders()
    });
  }
} 