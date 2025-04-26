import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PacksService } from '../../../services/packs.service';
import { MessagesModalService } from '../../../messages-modal.service';
import { Pack } from '../../../models/pack';
import { User } from '../../../models/user';
@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
@ViewChild(BaseChartDirective) chart?: BaseChartDirective; // Pour stocker le graphique
     // Pour stocker  l'abonnement a modifier
 public barChartType: ChartType = 'bar';
 public barChartOptions: ChartConfiguration['options'] = {
   responsive: true,
   plugins: {
     legend: { display: true },
   },
 };
 abonnements: Pack[] = [];
   filteredAbonnements: Pack[] = [];
   currentUser: User | null = null;
   selectedPack: Pack | null = null;
   showPaymentModal = false;
   isYearlyPricing: boolean = false;
 public barChartLabels: string[] = [];
   public barChartData: ChartConfiguration<'bar'>['data'] = {
     labels: [],
     datasets: [],
   };
 
  constructor( private packService: PacksService,
      private fb: FormBuilder,
      public messageService: MessagesModalService,
      private router: Router) { }

  ngOnInit(): void {
    this.packService.getMonthlyStats().subscribe(data => {
      const months = Object.keys(data).sort();
      const types = new Set<string>();

      months.forEach(m => Object.keys(data[m]).forEach(t => types.add(t)));

      this.barChartLabels = months;
      this.barChartData.labels = months;

      this.barChartData.datasets = Array.from(types).map(type => ({
        label: type,
        data: months.map(month => data[month][type] || 0),
        backgroundColor: this.generateColors(months.length),
      }));

      this.chart?.update();
    });
  }
  private generateColors(count: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      colors.push('#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
    }
    return colors;
  }
}
