"use client";

import Link from "next/link";
import {
  proprietaires,
  reservations,
  virements,
  menageParReservation,
  depensesPonctuelles,
  commissionAgencePct,
  topLocations,
} from "@/lib/mock-data";

function euros(n: number) {
  return (
    n.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €"
  );
}

function salutation() {
  const heure = new Date().getHours();
  return heure < 18 ? "Bonjour" : "Bonsoir";
}

function netReglePourProprietaire(proprietaireId: string) {
  const resas = reservations.filter((r) => r.proprietaireId === proprietaireId);
  const depenses = depensesPonctuelles.filter((d) => d.proprietaireId === proprietaireId);
  const totalEncaisse = resas.reduce((s, r) => s + r.hostPayout, 0);
  const totalMenage = resas.reduce((s, r) => s + (menageParReservation[r.id] ?? 0), 0);
  const sousTotal = totalEncaisse - totalMenage;
  const commission = sousTotal * commissionAgencePct;
  const net = sousTotal - commission;
  const totalDepenses = depenses.reduce((s, d) => s + d.montant, 0);
  return net - totalDepenses;
}

export default function AccueilPage() {
  const totalEncaisse = reservations.reduce((s, r) => s + r.hostPayout, 0);
  const commissionAgence = totalEncaisse * commissionAgencePct;

  const virementsAVerifier = virements.filter((v) => {
    const resas = reservations.filter((r) => v.reservationIds.includes(r.id));
    const attendu = resas.reduce((s, r) => s + r.hostPayout, 0);
    return Math.abs(v.montant - attendu) >= 0.01;
  });

  const aDesEcarts = virementsAVerifier.length > 0;

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-3xl text-teal mb-1">
        {salutation()}, Ingrid
      </h1>
      <p className="text-teal-light mb-6">
        Aperçu de votre mois — Septembre 2026
      </p>
      <div className="h-px bg-teal/10 mb-8" />

      {/* Hero : la commission agence */}
      <div className="bg-teal rounded-lg p-8 mb-6">
        <p className="text-white/60 text-sm mb-2">
          Votre commission d&apos;agence ce mois-ci
        </p>
        <div className="flex items-end justify-between">
          <p className="font-serif text-5xl text-white">
            {euros(commissionAgence)}
          </p>
          <p className="text-coral text-sm mb-1">
            {commissionAgencePct * 100}% du net encaissé
          </p>
        </div>
      </div>

      {/* Cartes secondaires */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-teal/10 p-6">
          <div className="flex items-center gap-2 mb-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-teal-light">
              <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M2 7h12" stroke="currentColor" strokeWidth="1.2" />
              <path d="M5 4V2.5h6V4" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <p className="text-sm text-teal-light">Total encaissé</p>
          </div>
          <p className="font-serif text-2xl text-teal">{euros(totalEncaisse)}</p>
          <p className="text-teal-light/70 text-xs mt-1">
            {proprietaires.length} propriétaires gérés
          </p>
        </div>

        <Link
          href="/dashboard/rapprochement"
          className={`rounded-lg border p-6 transition-colors ${
            aDesEcarts
              ? "bg-coral/10 border-coral/30 hover:bg-coral/15"
              : "bg-sage/10 border-sage/30 hover:bg-sage/15"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className={aDesEcarts ? "text-coral" : "text-sage"}
            >
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
              {aDesEcarts ? (
                <path d="M8 5v4M8 11h.01" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              ) : (
                <path d="M5.5 8l1.8 1.8L10.5 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
            <p className="text-sm text-teal-light">Écarts à vérifier</p>
          </div>
          <p className={`font-serif text-2xl ${aDesEcarts ? "text-coral" : "text-sage"}`}>
            {virementsAVerifier.length}
          </p>
          <p className="text-teal-light/70 text-xs mt-1">
            {aDesEcarts ? "Voir le rapprochement →" : "Tout est en ordre"}
          </p>
        </Link>
      </div>

      {/* Mini-liste des logements avec net à reverser */}
      <div className="bg-white rounded-lg border border-teal/10 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-teal/10">
          <p className="font-serif text-lg text-teal">Vos logements ce mois-ci</p>
        </div>
        {proprietaires.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between px-6 py-3 border-b border-teal/5 last:border-0"
          >
            <div>
              <p className="text-teal text-sm">{p.logement}</p>
              <p className="text-teal-light text-xs">{p.nom}</p>
            </div>
            <p className="font-serif text-lg text-teal tabular-nums">
              {euros(netReglePourProprietaire(p.id))}
            </p>
          </div>
        ))}
      </div>

      {/* Top 3 des locations les plus rentables, vraies annonces Enjoy Riviera */}
      <div className="mb-8">
        <p className="font-serif text-lg text-teal mb-4">
          Vos locations les plus prisées
        </p>
        <div className="grid grid-cols-3 gap-4">
          {topLocations.map((loc, i) => (
            <div key={loc.nom} className="bg-white rounded-lg border border-teal/10 p-5">
              <p className="text-coral text-xs mb-2">#{i + 1}</p>
              <p className="text-teal text-sm font-medium mb-1">{loc.nom}</p>
              <p className="text-teal-light text-xs mb-3">{loc.adresse}</p>
              <p className="font-serif text-xl text-teal">
                {loc.prixNuit} € <span className="text-sm text-teal-light">/ nuit</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/dashboard/import"
        className="inline-block bg-coral text-white rounded-md px-6 py-2.5 font-medium hover:bg-coral/90 transition-colors"
      >
        Démarrer le relevé du mois
      </Link>
      <p className="text-teal-light text-xs mt-3">
        Dernier relevé envoyé le 15 août · Prochaine échéance : 5 octobre
      </p>
    </div>
  );
}