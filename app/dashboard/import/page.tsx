"use client";

import { useState } from "react";
import { reservations } from "@/lib/mock-data";

type Source = "superhote" | "manuel" | null;
type ExplicationKey = "superhote" | "manuel";

const explications: Record<ExplicationKey, { titre: string; texte: string }> = {
  superhote: {
    titre: "Connexion Superhote",
    texte:
      "En production, l'application se connecte directement à l'API Superhote avec le token d'Ingrid. Chaque nuit, elle récupère automatiquement les nouvelles réservations, les montants nets attendus (host payout) et les propriétaires associés, sans aucune action de sa part. Dès qu'une réservation est créée, modifiée ou annulée sur Superhote, l'information est mise à jour ici en quelques secondes grâce aux webhooks.",
  },
  manuel: {
    titre: "Import manuel (CSV / Excel)",
    texte:
      "Ce mode sert de filet de sécurité si la connexion Superhote n'est pas encore active, ou pour une vérification ponctuelle. Ingrid dépose un export CSV ou Excel de ses réservations du mois, l'application lit le fichier et reconstruit automatiquement le même tableau que via l'API. Rien n'est perdu, elle peut basculer sur la connexion directe dès qu'elle est prête, sans changer ses habitudes.",
  },
};

export default function ImportPage() {
  const [source, setSource] = useState<Source>(null);
  const [popup, setPopup] = useState<ExplicationKey | null>(null);
  const [dejaImporteAlerte, setDejaImporteAlerte] = useState(false);

  const totalHostPayout = reservations.reduce((s, r) => s + r.hostPayout, 0);
  const importe = source !== null;

  function confirmerImport() {
    if (popup && source !== null) {
      setDejaImporteAlerte(true);
      setPopup(null);
      return;
    }
    if (popup) {
      setSource(popup);
      setPopup(null);
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-3xl text-teal mb-1">Import</h1>
      <p className="text-teal-light mb-8">
        Récupération des réservations du mois
      </p>

      {dejaImporteAlerte && (
        <div className="bg-coral/10 border border-coral/30 text-teal rounded-md px-4 py-3 mb-6 text-sm flex items-center justify-between">
          <span>
            Réservations déjà importées pour septembre. Revenez le mois
            prochain, ou consultez directement le rapprochement.
          </span>
          <button
            onClick={() => setDejaImporteAlerte(false)}
            className="text-teal-light hover:text-teal ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {!importe ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-teal/10 p-8 flex flex-col items-center text-center">
            <p className="text-teal mb-6 text-sm">
              Connexion directe à Superhote pour récupérer réservations,
              montants et propriétaires automatiquement.
            </p>
            <button
              onClick={() => setPopup("superhote")}
              className="bg-coral text-white rounded-md px-6 py-2.5 font-medium hover:bg-coral/90 transition-colors"
            >
              Importer depuis Superhote
            </button>
          </div>

          <div className="bg-white rounded-lg border border-teal/10 border-dashed p-8 flex flex-col items-center text-center">
            <p className="text-teal mb-6 text-sm">
              Pas encore connecté à Superhote ? Déposez un export CSV ou
              Excel du mois pour continuer sans attendre.
            </p>
            <button
              onClick={() => setPopup("manuel")}
              className="border border-teal text-teal rounded-md px-6 py-2.5 font-medium hover:bg-teal hover:text-white transition-colors"
            >
              Import manuel (CSV / Excel)
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-teal/10 p-6 mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-teal-light mb-1">
                Montant net attendu (host payout)
              </p>
              <p className="font-serif text-4xl text-teal">
                {totalHostPayout.toLocaleString("fr-FR", {
                  minimumFractionDigits: 2,
                })}{" "}
                €
              </p>
            </div>
            <div className="text-right text-sm">
              <p className="text-sage">
                {reservations.length} réservations récupérées
              </p>
              <p className="text-teal-light mt-1">
                Source :{" "}
                {source === "superhote" ? "Superhote" : "Import manuel"}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-teal/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-teal/10 text-left text-teal-light">
                  <th className="px-5 py-3 font-normal">Plateforme</th>
                  <th className="px-5 py-3 font-normal">Voyageur</th>
                  <th className="px-5 py-3 font-normal">Logement</th>
                  <th className="px-5 py-3 font-normal">Séjour</th>
                  <th className="px-5 py-3 font-normal text-right">
                    Net attendu
                  </th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id} className="border-b border-teal/5 last:border-0">
                    <td className="px-5 py-3 text-teal">{r.plateforme}</td>
                    <td className="px-5 py-3 text-teal">{r.voyageur}</td>
                    <td className="px-5 py-3 text-teal-light">{r.logement}</td>
                    <td className="px-5 py-3 text-teal-light">
                      {new Date(r.dateArrivee).toLocaleDateString("fr-FR")} →{" "}
                      {new Date(r.dateDepart).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-5 py-3 text-right text-teal tabular-nums">
                      {r.hostPayout.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={() => setPopup(source)}
            className="text-teal-light text-sm mt-4 hover:text-teal"
          >
            ← Changer de source
          </button>
        </>
      )}

      {popup && (
        <div
          className="fixed inset-0 bg-teal/40 flex items-center justify-center px-4 z-50"
          onClick={() => setPopup(null)}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-serif text-xl text-teal mb-4">
              {explications[popup].titre}
            </p>
            <p className="text-teal-light text-sm leading-relaxed mb-8">
              {explications[popup].texte}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPopup(null)}
                className="text-teal-light text-sm hover:text-teal"
              >
                Annuler
              </button>
              <button
                onClick={confirmerImport}
                className="bg-coral text-white rounded-md px-5 py-2 text-sm font-medium hover:bg-coral/90 transition-colors"
              >
                Voir les réservations
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}