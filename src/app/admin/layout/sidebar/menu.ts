import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'Acceuil',
    isTitle: true,
  },
  {
    label: 'Dashboard',
    icon: 'home',
    link: '/compte/admin/dashboard',
  },
  {
    label: 'Pages',
    isTitle: true,
  },

  {
    label: `abonnements`,
    icon: 'list',
    subItems: [
     
      {
        label: 'Toutes les abonnements',
        link: 'admin/abonnements',
      },
      { 
        label: 'Statistiques',
        link: 'admin/abonnements/stats',
      }
    ],
  },
  {
    label: 'Mes Revenus',
    icon: 'dollar-sign',
    link: '/compte/user-revenue',
  },
  {
    label: 'utilisateurs',
    icon: 'users',
    subItems: [  {
      label: 'Ajouter un utilisataur',
      link: 'admin/ajouter/utilisateur',
    },
      {
        label: 'Tous les utilisateurs',
        link: 'admin/utilisateurs',
      },
    ],
  },





  {
    label: 'Paramétres',
    isTitle: true,
  },

  {
    label: 'Mon compte',
    icon: 'settings',
    link: '/compte/admin/parametres',
  },
];
