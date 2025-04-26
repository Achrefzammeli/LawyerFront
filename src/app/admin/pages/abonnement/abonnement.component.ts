import { Component, OnInit } from '@angular/core';
import { Pack } from '../../../models/pack';
import { PacksService } from '../../../services/packs.service';
import { MessagesModalService } from '../../../messages-modal.service';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-abonnement',
  templateUrl: './abonnement.component.html',
  styleUrls: ['./abonnement.component.scss']
})
export class AbonnementComponent implements OnInit {


  stats: any = {}
  packForm: FormGroup;
  abonnements: Pack[] = [];
  filterText = '';
  filteredAbonnements: Pack[] = [];
  filteredAbonnementsCount: number = 0;
  currentUser: any;
  editMode = false; // Nouveau mode d'édition
  currentPack: Pack | null = null; 


  
  
  constructor(
    private packService: PacksService,
    private fb: FormBuilder,
    public messageService: MessagesModalService,
    private router: Router

  ) { }
 
  ngOnInit(): void {
     
    this.loadAllPack();
    this.loadStats();
    this.packForm = this.fb.group({
      id: [null],
      nom: ['', Validators.required],
      description: [''],
      prixMensuel: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      prixAnnuel: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      duree: [0, Validators.required],
      type: ['SILVER', Validators.required]
    });

    // Calcul automatique du prix annuel basé sur le prix mensuel
    this.packForm.get('prixMensuel')?.valueChanges.subscribe(value => {
      if (value && !isNaN(value)) {
        const prixMensuel = parseFloat(value);
        const prixAnnuel = (prixMensuel * 12 * 0.8).toFixed(2); // 20% discount on yearly price
        this.packForm.patchValue({ prixAnnuel }, { emitEvent: false });
      }
    });

    // Désactiver la modification manuelle du prix annuel
    this.packForm.get('prixAnnuel')?.disable();
  }
  editPack(pack: Pack): void {
    this.editMode = true;
    this.currentPack = { ...pack }; // Copie de l'objet pour éviter la mutation directe
    this.packForm.patchValue(this.currentPack); // Remplir les champs du formulaire
    const modal = new (window as any).bootstrap.Modal(document.getElementById('addPackModal'));
    modal.show();
  }
  
  submitEditAbonnement() {
    if (this.packForm.valid) {
      const packToUpdate = this.packForm.value;
      this.packService.updatePack(packToUpdate.id, packToUpdate).subscribe({
        next: () => {
          this.messageService.toastSuccess("Abonnement mis à jour avec succès !");
          this.loadAllPack();
          this.router.navigate(['compte/admin/abonnements']); // reset les champs
         // Réinitialiser le mode d'édition
          const modal = new (window as any).bootstrap.Modal(document.getElementById('addPackModal'));
          modal.hide();
        },
        error: () => {
          this.messageService.toastError("Erreur lors de la mise à jour !");
        }
      });
    }
  }
  loadAllPack() {
    this.packService.getAllPacks().subscribe(
      (abonnements: Pack[]) => {
        this.abonnements = abonnements.reverse();
        this.filterAbonnements();
      },
      (error) => {
        console.error('Error fetching abonnements:', error);
      }
    );
  }
   loadStats() {
    this.packService.getPackStats().subscribe({
      next: (res) => {
        this.stats = res.data;
      },
      error: (err) => {
        console.error("Erreur récupération statistiques", err);
        this.messageService.toastError("Erreur chargement statistiques");
      }
    });}
  

  filterAbonnements(): void {
    if (!this.filterText) {
      this.filteredAbonnements = this.abonnements; // No filter
    } else {
      const lowerFilter = this.filterText.toLowerCase();
      this.filteredAbonnements = this.abonnements.filter(pack => {
        const values = Object.values(pack).join(' ').toLowerCase();
        return values.includes(lowerFilter);
      });
    }
  }

  deletePack(id: number) {
    // Prompt the user for confirmation
    const confirmed = confirm('Are you sure you want to delete this abonnement?');
  
    if (confirmed) {
      // Call the service to delete the pack
      this.packService.deletePack(id).subscribe({
        next: () => {
          // On success, show a toast message
          this.messageService.toastSuccess("Abonnement a été supprimé avec succès");
  
          // Reload all packs
          this.loadAllPack();
        },
        error: (err) => {
          // Handle any errors that occur during the deletion
          this.messageService.toastError("Erreur lors de la suppression de l'abonnement");
          console.error(err);
        }
      });
    }
  }
  



  get filteredAbonnement(): Pack[] {
    return this.abonnements.filter(pack => {
      const values = Object.values(pack).join(' ').toLowerCase();
      return values.includes(this.filterText.toLowerCase());
    });
  }
  get filteredAbonnementCount(): number {
    return this.filteredAbonnements.length;
  }
  
 /* addAbonnement(newPack: Pack): void {
    this.packService.createPack(newPack).subscribe(
      (createdPack: Pack) => {
        this.abonnements.unshift(createdPack); // Add the new abonnement at the top
        this.filterAbonnements(); // Refresh the filtered list
        this.messageService.toastSuccess('Abonnement ajouté avec succès!');
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de l\'abonnement:', error);
        this.messageService.toastError('Erreur lors de l\'ajout de l\'abonnement.');
      }
    );
  }*/
    addAbonnement() {
      const modal = new (window as any).bootstrap.Modal(document.getElementById('addPackModal'));
      modal.show();
    }
    
    submitAddAbonnement() {
      if (this.packForm.valid) {
        this.packService.createPack(this.packForm.value).subscribe({
          next: () => {
            this.messageService.toastSuccess("Abonnement ajouté avec succès !");
            this.loadAllPack();
            this.router.navigate(['compte/admin/abonnements']); // reset les champs
            const modal = new (window as any).bootstrap.Modal(document.getElementById('addPackModal'));
            modal.hide();
          },
          error: () => {
            this.messageService.toastError("Erreur lors de l'ajout !");
          }
        });
      }
    }
    closeAndNavigate() {
      this.editMode = false;
      this.currentPack = null;
      const modal = new (window as any).bootstrap.Modal(document.getElementById('addPackModal'));
      modal.hide();
      this.router.navigate(['compte/admin/abonnements']);
    }
    
  }
