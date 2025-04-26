export interface PackAbonnement {
    id: number;
    nom: string;
    description: string;
    prixMensuel: string;
    prixAnnuel: string;
    duree: number;
    type: string;
    avantages: string[];
}

export interface UserInfo {
    id: number;
    nom: string;
    prenom: string;
    email: string;
}

export interface Paiement {
    id?: number;
    montant: number;
    methode: string;
    datePaiement: Date;
    packAbonnement: PackAbonnement;
    utilisateur: UserInfo;
} 