"use client";

import { useEffect, useState } from "react";

export default function CompteurAnime({ valeur }: { valeur: number }) {
  const [affiche, setAffiche] = useState(0);

  useEffect(() => {
    const duree = 800;
    const debut = performance.now();

    function tick(maintenant: number) {
      const progres = Math.min((maintenant - debut) / duree, 1);
      setAffiche(valeur * progres);
      if (progres < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [valeur]);

  return (
    <>
      {affiche.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
    </>
  );
}