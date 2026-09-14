"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("ingrid@enjoyriviera.fr");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      setError("Renseignez votre email et votre mot de passe.");
      return;
    }
    router.push("/dashboard/import");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            className="text-coral mb-3"
          >
            <path
              d="M20 4C20 4 14 10 14 18C14 22 16.5 24 20 24C23.5 24 26 22 26 18C26 10 20 4 20 4Z"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <path d="M20 24V36" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          <h1 className="font-serif text-2xl text-teal">Enjoy Riviera</h1>
          <p className="text-sm text-teal-light mt-1">
            Relevés propriétaires
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg p-8 shadow-sm border border-teal/10"
        >
          <div className="mb-4">
            <label className="block text-sm text-teal mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-teal/20 text-teal focus:outline-none focus:ring-2 focus:ring-coral/50 focus:border-coral"
              placeholder="ingrid@enjoyriviera.fr"
            />
          </div>

          <div className="mb-5">
            <label
              className="block text-sm text-teal mb-1.5"
              htmlFor="password"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-teal/20 text-teal focus:outline-none focus:ring-2 focus:ring-coral/50 focus:border-coral"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-coral mb-4">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-coral text-white rounded-md py-2.5 font-medium hover:bg-coral/90 transition-colors"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}