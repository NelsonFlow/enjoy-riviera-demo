"use client";

import { useState } from "react";
import {
  proprietaires,
  reservations,
  menageParReservation,
  depensesPonctuelles,
  commissionAgencePct,
} from "@/lib/mock-data";

function euros(n: number) {
  return (
    n.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €"
  );
}

const TEAL: [number, number, number] = [27, 74, 84];
const TEAL_LIGHT: [number, number, number] = [61, 107, 116];
const CORAL: [number, number, number] = [232, 152, 122];
const GREY: [number, number, number] = [225, 225, 225];

export default function RelevesPage() {
  const [selectionId, setSelectionId] = useState(proprietaires[0].id);
  const [telechargement, setTelechargement] = useState(false);

  const proprietaire = proprietaires.find((p) => p.id === selectionId)!;

  const resasProprio = reservations.filter(
    (r) => r.proprietaireId === proprietaire.id
  );
  const depensesProprio = depensesPonctuelles.filter(
    (d) => d.proprietaireId === proprietaire.id
  );

  const totalEncaisse = resasProprio.reduce((s, r) => s + r.hostPayout, 0);
  const totalMenage = resasProprio.reduce(
    (s, r) => s + (menageParReservation[r.id] ?? 0),
    0
  );
  const sousTotal = totalEncaisse - totalMenage;
  const commissionAgence = sousTotal * commissionAgencePct;
  const netProprietaire = sousTotal - commissionAgence;
  const totalDepenses = depensesProprio.reduce((s, d) => s + d.montant, 0);
  const netRegle = netProprietaire - totalDepenses;

  async function telechargerPdf() {
    setTelechargement(true);
    const { jsPDF } = await import("jspdf");

    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const margeGauche = 20;
    const margeDroite = 190;
    let y = 18;

    // Logo palmier (vecteur, même tracé que le site)
    const iconX = margeGauche;
    const iconY = 10;
    const s = 0.3;
    pdf.setFillColor(...CORAL);
    pdf.setDrawColor(...CORAL);
    pdf.lines(
      [
        [0, 0, -6, 6, -6, 14],
        [0, 4, 2.5, 6, 6, 6],
        [3.5, 0, 6, -2, 6, -6],
        [0, -8, -6, -14, -6, -14],
      ],
      iconX,
      iconY,
      [s, s],
      "F",
      true
    );
    pdf.setLineWidth(0.4);
    pdf.line(iconX, iconY + 6, iconX, iconY + 9.6);

    pdf.setFont("times", "normal");
    pdf.setFontSize(13);
    pdf.setTextColor(...CORAL);
    pdf.text("enjoy riviera", iconX + 8, iconY + 6);

    y = 30;
    pdf.setDrawColor(...GREY);
    pdf.setLineWidth(0.2);
    pdf.line(margeGauche, y, margeDroite, y);
    y += 10;

    // En-tête du relevé
    pdf.setFont("times", "bold");
    pdf.setFontSize(20);
    pdf.setTextColor(...TEAL);
    pdf.text(proprietaire.logement, margeGauche, y);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(...TEAL_LIGHT);
    pdf.text(proprietaire.nom, margeGauche, y + 7);

    pdf.setFontSize(9);
    pdf.text("Relevé — Septembre 2026", margeDroite, y, { align: "right" });
    pdf.text("Émis le 14/09/2026", margeDroite, y + 5, { align: "right" });

    y += 15;
    pdf.setDrawColor(...TEAL);
    pdf.setLineWidth(0.3);
    pdf.line(margeGauche, y, margeDroite, y);
    y += 10;

    // Tableau des réservations
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(...TEAL_LIGHT);
    pdf.text("Plateforme", margeGauche, y);
    pdf.text("Séjour", margeGauche + 28, y);
    pdf.text("Voyageur", margeGauche + 78, y);
    pdf.text("Net encaissé", margeDroite, y, { align: "right" });
    y += 3;
    pdf.setDrawColor(...GREY);
    pdf.line(margeGauche, y, margeDroite, y);
    y += 6;

    pdf.setFont("helvetica", "normal");
    resasProprio.forEach((r) => {
      pdf.setTextColor(...TEAL);
      pdf.text(r.plateforme, margeGauche, y);
      pdf.setTextColor(...TEAL_LIGHT);
      const sejour = `${new Date(r.dateArrivee).toLocaleDateString(
        "fr-FR"
      )} - ${new Date(r.dateDepart).toLocaleDateString("fr-FR")}`;
      pdf.text(sejour, margeGauche + 28, y);
      pdf.text(r.voyageur, margeGauche + 78, y);
      pdf.setTextColor(...TEAL);
      pdf.text(euros(r.hostPayout), margeDroite, y, { align: "right" });
      y += 7;
      pdf.setDrawColor(...GREY);
      pdf.line(margeGauche, y - 3, margeDroite, y - 3);
    });

    y += 6;

    // Bloc des totaux, aligné à droite
    const ligne = (
      label: string,
      valeur: string,
      couleur: [number, number, number] = TEAL,
      gras = false
    ) => {
      pdf.setFont("helvetica", gras ? "bold" : "normal");
      pdf.setFontSize(gras ? 11 : 10);
      pdf.setTextColor(...couleur);
      pdf.text(label, margeGauche + 90, y);
      pdf.text(valeur, margeDroite, y, { align: "right" });
      y += 7;
    };

    ligne("Total encaissé", euros(totalEncaisse));
    ligne("Ménage et linge", `- ${euros(totalMenage)}`, TEAL_LIGHT);
    pdf.setDrawColor(...GREY);
    pdf.line(margeGauche + 90, y - 2, margeDroite, y - 2);
    ligne("Sous-total", euros(sousTotal));
    ligne(
      `Commission agence (${commissionAgencePct * 100}%)`,
      `- ${euros(commissionAgence)}`,
      TEAL_LIGHT
    );
    pdf.line(margeGauche + 90, y - 2, margeDroite, y - 2);
    ligne("Net propriétaire", euros(netProprietaire), TEAL, true);

    depensesProprio.forEach((d) => {
      ligne(d.libelle, `- ${euros(d.montant)}`, CORAL);
    });

    // Bandeau final mis en avant, comme le "hero" du site
    y += 4;
    pdf.setFillColor(...TEAL);
    pdf.roundedRect(margeGauche, y, margeDroite - margeGauche, 16, 2, 2, "F");
    pdf.setFont("times", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(255, 255, 255);
    pdf.text("Net réglé par virement", margeGauche + 6, y + 10.5);
    pdf.text(euros(netRegle), margeDroite - 6, y + 10.5, { align: "right" });

    pdf.save(
      `releve-${proprietaire.logement.replace(/\s+/g, "-").toLowerCase()}.pdf`
    );
    setTelechargement(false);
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-3xl text-teal mb-1">Relevés</h1>
      <p className="text-teal-light mb-8">
        Relevé mensuel par propriétaire, prêt à envoyer
      </p>

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {proprietaires.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectionId(p.id)}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                p.id === selectionId
                  ? "bg-teal text-white"
                  : "bg-white text-teal-light border border-teal/10 hover:text-teal"
              }`}
            >
              {p.logement}
            </button>
          ))}
        </div>

        <button
          onClick={telechargerPdf}
          disabled={telechargement}
          className="border border-teal text-teal rounded-md px-4 py-2 text-sm font-medium hover:bg-teal hover:text-white transition-colors disabled:opacity-50"
        >
          {telechargement ? "Génération..." : "Télécharger le PDF"}
        </button>
      </div>

      <div className="bg-white rounded-lg border border-teal/10 p-10">
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-teal/10">
          <div>
            <p className="font-serif text-xl text-teal">{proprietaire.logement}</p>
            <p className="text-teal-light text-sm mt-1">{proprietaire.nom}</p>
          </div>
          <div className="text-right text-sm text-teal-light">
            <p>Relevé — Septembre 2026</p>
            <p>Émis le 14/09/2026</p>
          </div>
        </div>

        <table className="w-full text-sm mb-6">
          <thead>
            <tr className="text-left text-teal-light">
              <th className="py-2 font-normal">Plateforme</th>
              <th className="py-2 font-normal">Séjour</th>
              <th className="py-2 font-normal">Voyageur</th>
              <th className="py-2 font-normal text-right">Net encaissé</th>
            </tr>
          </thead>
          <tbody>
            {resasProprio.map((r) => (
              <tr key={r.id} className="border-t border-teal/5">
                <td className="py-2.5 text-teal">{r.plateforme}</td>
                <td className="py-2.5 text-teal-light">
                  {new Date(r.dateArrivee).toLocaleDateString("fr-FR")} →{" "}
                  {new Date(r.dateDepart).toLocaleDateString("fr-FR")}
                </td>
                <td className="py-2.5 text-teal-light">{r.voyageur}</td>
                <td className="py-2.5 text-right text-teal tabular-nums">
                  {euros(r.hostPayout)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="space-y-2 text-sm max-w-xs ml-auto">
          <div className="flex justify-between text-teal">
            <span>Total encaissé</span>
            <span className="tabular-nums">{euros(totalEncaisse)}</span>
          </div>
          <div className="flex justify-between text-teal-light">
            <span>Ménage et linge</span>
            <span className="tabular-nums">− {euros(totalMenage)}</span>
          </div>
          <div className="flex justify-between text-teal pt-2 border-t border-teal/10">
            <span>Sous-total</span>
            <span className="tabular-nums">{euros(sousTotal)}</span>
          </div>
          <div className="flex justify-between text-teal-light">
            <span>Commission agence ({commissionAgencePct * 100}%)</span>
            <span className="tabular-nums">− {euros(commissionAgence)}</span>
          </div>
          <div className="flex justify-between text-teal font-medium pt-2 border-t border-teal/10">
            <span>Net propriétaire</span>
            <span className="tabular-nums">{euros(netProprietaire)}</span>
          </div>

          {depensesProprio.map((d) => (
            <div key={d.id} className="flex justify-between text-coral">
              <span>{d.libelle}</span>
              <span className="tabular-nums">− {euros(d.montant)}</span>
            </div>
          ))}

          <div className="flex justify-between font-serif text-xl text-teal pt-3 border-t border-teal/20">
            <span>Net réglé par virement</span>
            <span className="tabular-nums">{euros(netRegle)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}