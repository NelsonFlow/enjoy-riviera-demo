export type Reservation = {
  id: string;
  plateforme: "Airbnb" | "Booking" | "Direct";
  voyageur: string;
  dateArrivee: string;
  dateDepart: string;
  logement: string;
  proprietaireId: string;
  montantBrut: number;
  commissionPlateforme: number;
  fraisService: number;
  taxeSejour: number;
  hostPayout: number;
};

export type Proprietaire = {
  id: string;
  nom: string;
  logement: string;
};

export type VirementBancaire = {
  id: string;
  date: string;
  libelle: string;
  montant: number;
  reservationIds: string[];
};

export type DepensePonctuelle = {
  id: string;
  proprietaireId: string;
  libelle: string;
  montant: number;
};

export type LocationVitrine = {
  nom: string;
  adresse: string;
  prixNuit: number;
  chambres: number;
  voyageurs: number;
};

export const proprietaires: Proprietaire[] = [
  { id: "p1", nom: "Kislev — SI Bureautique", logement: "Loft 121" },
  { id: "p2", nom: "Miriam Cherrati", logement: "Casa Mia" },
  { id: "p3", nom: "Jean-Charles Bosca", logement: "Palais Miramar" },
  { id: "p4", nom: "Svetlana Karam", logement: "Withe Meynadier" },
];

export const reservations: Reservation[] = [
  // Loft 121 — vrai décompte août 2026, dates décalées d'un mois pour rester en septembre
  {
    id: "r1",
    plateforme: "Booking",
    voyageur: "Gharib",
    dateArrivee: "2026-08-26",
    dateDepart: "2026-08-31",
    logement: "Loft 121",
    proprietaireId: "p1",
    montantBrut: 1860.10,
    commissionPlateforme: 0,
    fraisService: 0,
    taxeSejour: 0,
    hostPayout: 1860.10,
  },
  {
    id: "r2",
    plateforme: "Airbnb",
    voyageur: "Klimkovitch",
    dateArrivee: "2026-08-31",
    dateDepart: "2026-09-02",
    logement: "Loft 121",
    proprietaireId: "p1",
    montantBrut: 743.60,
    commissionPlateforme: 0,
    fraisService: 0,
    taxeSejour: 0,
    hostPayout: 743.60,
  },
  {
    id: "r3",
    plateforme: "Direct",
    voyageur: "Jassim",
    dateArrivee: "2026-09-02",
    dateDepart: "2026-09-12",
    logement: "Loft 121",
    proprietaireId: "p1",
    montantBrut: 5180.00,
    commissionPlateforme: 0,
    fraisService: 0,
    taxeSejour: 0,
    hostPayout: 5180.00,
  },
  {
    id: "r4",
    plateforme: "Airbnb",
    voyageur: "Goku",
    dateArrivee: "2026-09-13",
    dateDepart: "2026-09-18",
    logement: "Loft 121",
    proprietaireId: "p1",
    montantBrut: 1618.17,
    commissionPlateforme: 0,
    fraisService: 0,
    taxeSejour: 0,
    hostPayout: 1618.17,
  },
  {
    id: "r5",
    plateforme: "Airbnb",
    voyageur: "Batti",
    dateArrivee: "2026-09-28",
    dateDepart: "2026-09-29",
    logement: "Loft 121",
    proprietaireId: "p1",
    montantBrut: 391.23,
    commissionPlateforme: 0,
    fraisService: 0,
    taxeSejour: 0,
    hostPayout: 391.23,
  },

  // Casa Mia — vrai décompte août 2026, dates décalées d'un mois
  {
    id: "r6",
    plateforme: "Airbnb",
    voyageur: "Mimoun",
    dateArrivee: "2026-09-03",
    dateDepart: "2026-09-09",
    logement: "Casa Mia",
    proprietaireId: "p2",
    montantBrut: 1771.82,
    commissionPlateforme: 0,
    fraisService: 0,
    taxeSejour: 0,
    hostPayout: 1771.82,
  },
  {
    id: "r7",
    plateforme: "Airbnb",
    voyageur: "Mohammed",
    dateArrivee: "2026-09-10",
    dateDepart: "2026-09-15",
    logement: "Casa Mia",
    proprietaireId: "p2",
    montantBrut: 1393.40,
    commissionPlateforme: 0,
    fraisService: 0,
    taxeSejour: 0,
    hostPayout: 1393.40,
  },
  {
    id: "r8",
    plateforme: "Airbnb",
    voyageur: "Alharbi",
    dateArrivee: "2026-09-15",
    dateDepart: "2026-09-21",
    logement: "Casa Mia",
    proprietaireId: "p2",
    montantBrut: 1635.07,
    commissionPlateforme: 0,
    fraisService: 0,
    taxeSejour: 0,
    hostPayout: 1635.07,
  },
  {
    id: "r9",
    plateforme: "Airbnb",
    voyageur: "Chanana",
    dateArrivee: "2026-09-21",
    dateDepart: "2026-09-24",
    logement: "Casa Mia",
    proprietaireId: "p2",
    montantBrut: 723.32,
    commissionPlateforme: 0,
    fraisService: 0,
    taxeSejour: 0,
    hostPayout: 723.32,
  },
  {
    id: "r10",
    plateforme: "Airbnb",
    voyageur: "Corbet",
    dateArrivee: "2026-09-24",
    dateDepart: "2026-09-30",
    logement: "Casa Mia",
    proprietaireId: "p2",
    montantBrut: 1651.13,
    commissionPlateforme: 0,
    fraisService: 0,
    taxeSejour: 0,
    hostPayout: 1651.13,
  },

  // Palais Miramar et Withe Meynadier — issus de la capture Superhote
  {
    id: "r11",
    plateforme: "Booking",
    voyageur: "Jean-Charles Bosca",
    dateArrivee: "2026-09-07",
    dateDepart: "2026-09-14",
    logement: "Palais Miramar",
    proprietaireId: "p3",
    montantBrut: 1190,
    commissionPlateforme: 178.5,
    fraisService: 0,
    taxeSejour: 24.5,
    hostPayout: 987,
  },
  {
    id: "r12",
    plateforme: "Airbnb",
    voyageur: "Konstantinos P.",
    dateArrivee: "2026-09-11",
    dateDepart: "2026-09-15",
    logement: "Palais Miramar",
    proprietaireId: "p3",
    montantBrut: 366,
    commissionPlateforme: 54.9,
    fraisService: 8.2,
    taxeSejour: 0,
    hostPayout: 302.9,
  },
  {
    id: "r13",
    plateforme: "Booking",
    voyageur: "Svetlana Karam",
    dateArrivee: "2026-09-11",
    dateDepart: "2026-09-13",
    logement: "Withe Meynadier",
    proprietaireId: "p4",
    montantBrut: 220,
    commissionPlateforme: 33,
    fraisService: 0,
    taxeSejour: 4.5,
    hostPayout: 182.5,
  },
];

// v5 (Palais Miramar) est volontairement inférieur de 20€ au host payout attendu
// (987 + 302,90 = 1289,90€ attendu, contre 1269,90€ reçu), pour illustrer
// un écart détecté sur l'écran de rapprochement.
export const virements: VirementBancaire[] = [
  { id: "v1", date: "2026-10-02", libelle: "VIR BOOKING.COM", montant: 1860.10, reservationIds: ["r1"] },
  { id: "v2", date: "2026-10-02", libelle: "VIR AIRBNB PAYMENTS", montant: 2753.00, reservationIds: ["r2", "r4", "r5"] },
  { id: "v3", date: "2026-10-02", libelle: "VIR SEPA JASSIM", montant: 5180.00, reservationIds: ["r3"] },
  { id: "v4", date: "2026-10-01", libelle: "VIR AIRBNB PAYMENTS", montant: 7174.74, reservationIds: ["r6", "r7", "r8", "r9", "r10"] },
  { id: "v5", date: "2026-09-15", libelle: "VIR BOOKING.COM", montant: 1269.90, reservationIds: ["r11", "r12"] },
  { id: "v6", date: "2026-09-14", libelle: "VIR BOOKING.COM", montant: 182.50, reservationIds: ["r13"] },
];

// Forfait ménage/linge par réservation, en euros — vrais montants des décomptes
export const menageParReservation: Record<string, number> = {
  r1: 150, r2: 150, r3: 150, r4: 150, r5: 150, // Loft 121 : 5 x 150€
  r6: 95, r7: 95, r8: 95, r9: 95, r10: 95,     // Casa Mia : 5 x 95€
  r11: 120,
  r12: 70,
  r13: 60,
};

// Vraies dépenses ponctuelles du décompte Casa Mia (achats + intervention Abousha)
export const depensesPonctuelles: DepensePonctuelle[] = [
  { id: "d1", proprietaireId: "p2", libelle: "Rideaux + tringle (Maxi Bazar)", montant: 49.98 },
  { id: "d2", proprietaireId: "p2", libelle: "Tapis sol chambre (Maxi Bazar)", montant: 12.99 },
  { id: "d3", proprietaireId: "p2", libelle: "Démontage volet, tringle, débouchage (Abousha)", montant: 125.00 },
];

export const commissionAgencePct = 0.2;

// Top 3 des annonces les plus chères d'Enjoy Riviera, reprises directement de enjoyriviera.fr
export const topLocations: LocationVitrine[] = [
  { nom: "La Réale Croisette", adresse: "82 Boulevard de la Croisette", prixNuit: 261, chambres: 3, voyageurs: 6 },
  { nom: "La suite du palais luxe", adresse: "5 Square Mérimée", prixNuit: 171, chambres: 2, voyageurs: 4 },
  { nom: "Le Boudoir", adresse: "18 Rue de Mimont", prixNuit: 110, chambres: 2, voyageurs: 4 },
];