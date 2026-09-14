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

function calculerNetRegle(proprietaireId: string) {
  const resas = reservations.filter((r) => r.proprietaireId === proprietaireId);
  const depenses = depensesPonctuelles.filter(
    (d) => d.proprietaireId === proprietaireId
  );
  const totalEncaisse = resas.reduce((s, r) => s + r.hostPayout, 0);
  const totalMenage = resas.reduce(
    (s, r) => s + (menageParReservation[r.id] ?? 0),
    0
  );
  const sousTotal = totalEncaisse - totalMenage;
  const commission = sousTotal * commissionAgencePct;
  const net = sousTotal - commission;
  const totalDepenses = depenses.reduce((s, d) => s + d.montant, 0);
  return net - totalDepenses;
}

export default function EnvoiPage() {
  const [envoyes, setEnvoyes] = useState<string[]>([]);
  const [selection, setSelection] = useState<string[]>(
    proprietaires.map((p) => p.id)
  );
  const [enCours, setEnCours] = useState(false);
  const [apercu, setApercu] = useState<string | null>(null);

  const restants = proprietaires.filter((p) => !envoyes.includes(p.id));
  const selectionRestante = selection.filter((id) =>
    restants.some((p) => p.id === id)
  );

  function toggleSelection(id: string) {
    setSelection((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function toggleTout() {
    if (selectionRestante.length === restants.length) {
      setSelection((prev) => prev.filter((id) => !restants.some((p) => p.id === id)));
    } else {
      setSelection((prev) => [
        ...prev,
        ...restants.map((p) => p.id).filter((id) => !prev.includes(id)),
      ]);
    }
  }

  function envoyerSelection() {
    if (selectionRestante.length === 0) return;
    setEnCours(true);
    selectionRestante.forEach((id, index) => {
      setTimeout(() => {
        setEnvoyes((prev) => [...prev, id]);
        if (index === selectionRestante.length - 1) {
          setEnCours(false);
        }
      }, (index + 1) * 400);
    });
  }

  function envoyerUnSeul(id: string) {
    setEnvoyes((prev) => [...prev, id]);
  }

  const toutEnvoye = envoyes.length === proprietaires.length;
  const proprietaireApercu = proprietaires.find((p) => p.id === apercu);

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-3xl text-teal mb-1">Envoi</h1>
      <p className="text-teal-light mb-8">
        Envoi des relevés validés aux propriétaires
      </p>

      <div className="bg-teal rounded-lg p-8 mb-6 flex items-center justify-center gap-8">
        <div className="text-center">
          <p className="text-white/50 text-xs uppercase tracking-wide mb-2">
            Avant
          </p>
          <p className="font-serif text-4xl text-white/40 line-through">
            20 h
          </p>
          <p className="text-white/40 text-sm mt-1">par mois</p>
        </div>
        <div className="text-coral text-2xl">→</div>
        <div className="text-center">
          <p className="text-coral text-xs uppercase tracking-wide mb-2">
            Avec l&apos;automatisation
          </p>
          <p className="font-serif text-4xl text-white">2 min</p>
          <p className="text-white/60 text-sm mt-1">par mois</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-teal/10 overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-teal/10 text-left text-teal-light">
              <th className="px-5 py-3 font-normal w-10">
                {!toutEnvoye && (
                  <input
                    type="checkbox"
                    checked={
                      selectionRestante.length === restants.length &&
                      restants.length > 0
                    }
                    onChange={toggleTout}
                    className="accent-coral w-4 h-4"
                  />
                )}
              </th>
              <th className="px-5 py-3 font-normal">Propriétaire</th>
              <th className="px-5 py-3 font-normal">Logement</th>
              <th className="px-5 py-3 font-normal text-right">Statut</th>
              <th className="px-5 py-3 font-normal text-right"></th>
            </tr>
          </thead>
          <tbody>
            {proprietaires.map((p) => {
              const envoye = envoyes.includes(p.id);
              const coche = selection.includes(p.id);
              return (
                <tr key={p.id} className="border-b border-teal/5 last:border-0">
                  <td className="px-5 py-3">
                    {!envoye && (
                      <input
                        type="checkbox"
                        checked={coche}
                        onChange={() => toggleSelection(p.id)}
                        className="accent-coral w-4 h-4"
                      />
                    )}
                  </td>
                  <td className="px-5 py-3 text-teal">{p.nom}</td>
                  <td className="px-5 py-3 text-teal-light">{p.logement}</td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 text-sm transition-opacity duration-300 ${
                        envoye ? "text-sage opacity-100" : "text-teal-light/50"
                      }`}
                    >
                      {envoye && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <circle cx="7" cy="7" r="6.5" stroke="currentColor" />
                          <path
                            d="M4 7l2 2 4-4.5"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                      {envoye ? "Envoyé" : "En attente"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => setApercu(p.id)}
                      className="text-teal-light text-xs hover:text-teal underline underline-offset-2 mr-3"
                    >
                      Aperçu
                    </button>
                    {!envoye && (
                      <button
                        onClick={() => envoyerUnSeul(p.id)}
                        className="text-teal-light text-xs hover:text-teal underline underline-offset-2"
                      >
                        Envoyer seul
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!toutEnvoye ? (
        <button
          onClick={envoyerSelection}
          disabled={enCours || selectionRestante.length === 0}
          className="bg-coral text-white rounded-md px-6 py-2.5 font-medium hover:bg-coral/90 transition-colors disabled:opacity-60"
        >
          {enCours
            ? "Envoi en cours..."
            : `Envoyer ${selectionRestante.length} relevé${
                selectionRestante.length > 1 ? "s" : ""
              } par email`}
        </button>
      ) : (
        <p className="text-sage text-sm">
          Les {proprietaires.length} relevés ont été envoyés par email.
        </p>
      )}

      {proprietaireApercu && (
        <div
          className="fixed inset-0 bg-teal/40 flex items-center justify-center px-4 z-50"
          onClick={() => setApercu(null)}
        >
          <div
            className="bg-white rounded-lg max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-cream px-6 py-4 border-b border-teal/10 text-sm text-teal-light space-y-1">
              <p>
                <span className="text-teal-light/70">De :</span> Enjoy
                Riviera &lt;contact@enjoyriviera.fr&gt;
              </p>
              <p>
                <span className="text-teal-light/70">À :</span>{" "}
                {proprietaireApercu.nom}
              </p>
              <p>
                <span className="text-teal-light/70">Objet :</span> Votre
                relevé — {proprietaireApercu.logement} — Septembre 2026
              </p>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <svg width="20" height="20" viewBox="0 0 40 40" fill="none" className="text-coral">
                  <path
                    d="M20 4C20 4 14 10 14 18C14 22 16.5 24 20 24C23.5 24 26 22 26 18C26 10 20 4 20 4Z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <path d="M20 24V36" stroke="currentColor" strokeWidth="1.3" />
                </svg>
                <span className="font-serif text-teal">enjoy riviera</span>
              </div>

              <p className="text-teal text-sm mb-4">
                Bonjour {proprietaireApercu.nom.split(" ").pop()},
              </p>
              <p className="text-teal-light text-sm mb-6 leading-relaxed">
                Voici le relevé de votre logement{" "}
                <strong className="text-teal">
                  {proprietaireApercu.logement}
                </strong>{" "}
                pour le mois de septembre 2026. Le détail complet est
                disponible dans le PDF joint à cet email.
              </p>

              <div className="bg-cream rounded-md p-5 mb-6 flex items-center justify-between">
                <span className="text-teal text-sm">
                  Net réglé par virement
                </span>
                <span className="font-serif text-2xl text-teal">
                  {euros(calculerNetRegle(proprietaireApercu.id))}
                </span>
              </div>

              <div className="flex items-center gap-2 text-teal-light text-xs border border-teal/10 rounded-md px-3 py-2 w-fit mb-6">
                <span>📎</span>
                <span>
                  releve-
                  {proprietaireApercu.logement
                    .replace(/\s+/g, "-")
                    .toLowerCase()}
                  .pdf
                </span>
              </div>

              <p className="text-teal-light text-sm">
                Bien cordialement,
                <br />
                L&apos;équipe Enjoy Riviera
              </p>
            </div>

            <div className="px-6 py-4 border-t border-teal/10 flex justify-end">
              <button
                onClick={() => setApercu(null)}
                className="text-teal-light text-sm hover:text-teal"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}