import { Component, OnInit } from '@angular/core';
import { UserSubscriptionService } from '../../services/user-subscription.service';
import { Paiement } from '../../models/payment.model';
import { MessagesModalService } from '../../messages-modal.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-subscriptions',
  templateUrl: './user-subscriptions.component.html',
  styleUrls: ['./user-subscriptions.component.scss']
})
export class UserSubscriptionsComponent implements OnInit {
  subscriptions: Paiement[] = [];
  activeSubscription: Paiement | null = null;
  currentUser: User | null = null;
  isLoading = true;

  constructor(
    private subscriptionService: UserSubscriptionService,
    private messagesModalService: MessagesModalService
  ) { }

  ngOnInit(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
      this.loadUserSubscriptions();
    }
  }

  loadUserSubscriptions(): void {
    if (!this.currentUser) return;

    this.isLoading = true;
    this.subscriptionService.getUserSubscriptions(this.currentUser.id).subscribe({
      next: (subscriptions) => {
        this.subscriptions = subscriptions;
        this.loadActiveSubscription();
      },
      error: (error) => {
        this.messagesModalService.toastError('Erreur lors du chargement des abonnements');
        console.error('Error loading subscriptions:', error);
        this.isLoading = false;
      }
    });
  }

  loadActiveSubscription(): void {
    if (!this.currentUser) return;

    this.subscriptionService.getActiveSubscription(this.currentUser.id).subscribe({
      next: (subscription) => {
        this.activeSubscription = subscription;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading active subscription:', error);
        this.isLoading = false;
      }
    });
  }

  getSubscriptionStatus(payment: Paiement): string {
    const endDate = new Date(payment.datePaiement);
    endDate.setDate(endDate.getDate() + payment.packAbonnement.duree);
    
    if (endDate < new Date()) {
      return 'Expiré';
    } else if (this.activeSubscription?.id === payment.id) {
      return 'Actif';
    } else {
      return 'Inactif';
    }
  }

  getSubscriptionProgress(payment: Paiement): number {
    const startDate = new Date(payment.datePaiement);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + payment.packAbonnement.duree);
    
    const totalDays = payment.packAbonnement.duree;
    const elapsedDays = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
  }

  getRemainingDays(payment: Paiement): number {
    const startDate = new Date(payment.datePaiement);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + payment.packAbonnement.duree);
    
    const remainingDays = Math.floor((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, remainingDays);
  }
} 