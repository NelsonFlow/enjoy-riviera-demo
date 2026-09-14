"use client";

import { useState } from "react";
import { reservations, virements } from "@/lib/mock-data";
import CompteurAnime from "@/components/CompteurAnime";

function reservationsPourVirement(reservationIds: string[]) {
  return reservations.filter((r) => reservationIds.includes(r.id));
}

export default function RapprochementPage() {
  const [popupVirementId, setPopupVirementId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [resolus, setResolus] = useState<string[]>([]);

  const totalAttendu = reservations.reduce((s, r) => s + r.hostPayout, 0);
  const totalRecu = virements.reduce((s, v) => s + v.montant, 0);
  const ecart = totalRecu - totalAttendu;

  const virementPopup = virements.find((v) => v.id === popupVirementId);

  function ouvrirPopup(id: string) {
    setNote("");
    setPopupVirementId(id);
  }

  function marquerResolu() {
    if (popupVirementId) {
      setResolus((prev) => [...prev, popupVirementId]);
      setPopupVirementId(null);
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-3xl text-teal mb-1">Rapprochement</h1>
      <p className="text-teal-light mb-8">
        Comparaison des virements reçus avec les montants attendus
      </p>

      <div className="bg-white rounded-lg border border-teal/10 p-6 mb-6 grid grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-teal-light mb-1">Reçu sur le compte</p>
          <p className="font-serif text-3xl text-teal">
            <CompteurAnime valeur={totalRecu} />
          </p>
        </div>
        <div>
          <p className="text-sm text-teal-light mb-1">Attendu (Superhote)</p>
          <p className="font-serif text-3xl text-teal">
            <CompteurAnime valeur={totalAttendu} />
          </p>
        </div>
        <div>
          <p className="text-sm text-teal-light mb-1">Écart</p>
          <p
            className={`font-serif text-3xl ${
              Math.abs(ecart) < 0.01 ? "text-sage" : "text-coral"
            }`}
          >
            {ecart >= 0 ? "+" : "-"}
            <CompteurAnime valeur={Math.abs(ecart)} />
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-teal/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-teal/10 text-left text-teal-light">
              <th className="px-5 py-3 font-normal">Statut</th>
              <th className="px-5 py-3 font-normal">Virement</th>
              <th className="px-5 py-3 font-normal">Réservations rattachées</th>
              <th className="px-5 py-3 font-normal text-right">Reçu</th>
              <th className="px-5 py-3 font-normal text-right">Attendu</th>
            </tr>
          </thead>
          <tbody>
            {virements.map((v) => {
              const resas = reservationsPourVirement(v.reservationIds);
              const attendu = resas.reduce((s, r) => s + r.hostPayout, 0);
              const valide = Math.abs(v.montant - attendu) < 0.01;
              const resolu = resolus.includes(v.id);
              const cliquable = !valide && !resolu;

              return (
                <tr
                  key={v.id}
                  onClick={() => cliquable && ouvrirPopup(v.id)}
                  className={`border-b border-teal/5 last:border-0 align-top ${
                    cliquable ? "cursor-pointer hover:bg-cream/60" : ""
                  }`}
                >
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        valide || resolu ? "bg-sage" : "bg-coral"
                      }`}
                      title={valide ? "Validé" : resolu ? "Résolu" : "À vérifier"}
                    />
                  </td>
                  <td className="px-5 py-4 text-teal">
                    <div>{v.libelle}</div>
                    <div className="text-teal-light text-xs mt-0.5">
                      {new Date(v.date).toLocaleDateString("fr-FR")}
                    </div>
                    {resolu && (
                      <div className="text-sage text-xs mt-1">✓ Résolu</div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-teal-light">
                    {resas.map((r) => (
                      <div key={r.id}>
                        {r.voyageur} — {r.logement}
                      </div>
                    ))}
                  </td>
                  <td className="px-5 py-4 text-right text-teal tabular-nums">
                    {v.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums">
                    <span className={valide || resolu ? "text-teal-light" : "text-coral"}>
                      {attendu.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {virementPopup && (
        <div
          className="fixed inset-0 bg-teal/40 flex items-center justify-center px-4 z-50"
          onClick={() => setPopupVirementId(null)}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-serif text-xl text-teal mb-1">
              Écart détecté
            </p>
            <p className="text-teal-light text-sm mb-6">
              {virementPopup.libelle} du{" "}
              {new Date(virementPopup.date).toLocaleDateString("fr-FR")}
            </p>

            <label className="block text-sm text-teal mb-1.5">
              Note explicative
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Ex : virement en retard, reçu le 20 finalement."
              className="w-full px-3 py-2 rounded-md border border-teal/20 text-teal text-sm focus:outline-none focus:ring-2 focus:ring-coral/50 focus:border-coral mb-6"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPopupVirementId(null)}
                className="text-teal-light text-sm hover:text-teal"
              >
                Annuler
              </button>
              <button
                onClick={marquerResolu}
                className="bg-coral text-white rounded-md px-5 py-2 text-sm font-medium hover:bg-coral/90 transition-colors"
              >
                Marquer comme résolu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}