export class Pack {
    id: number;
    nom: string;
    description: string;
    prixMensuel: string;
    prixAnnuel: string;
    duree: number;
    type: string; // 'SILVER' | 'GOLD' | 'PLATINUM'
    avantages: string[];
}