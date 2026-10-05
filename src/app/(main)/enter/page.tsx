"use client";

import { useState, FormEvent, useEffect, useRef, Suspense } from "react";
import { verifyPassword } from "./actions";
import { useRouter, useSearchParams } from "next/navigation";

function EnterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const pwdFromUrl = searchParams.get("pwd");
    if (pwdFromUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional initialization from URL param
      setPassword(pwdFromUrl);
      const formData = new FormData();
      formData.append("password", pwdFromUrl);
      verifyPassword(formData).then((result) => {
        if (result.success) {
          router.push("/");
          router.refresh();
        } else {
          setError(result.error || "Mot de passe incorrect");
        }
      });
    }
  }, [searchParams, router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("password", password);

    const result = await verifyPassword(formData);

    if (result.success) {
      router.push("/");
      router.refresh();
    } else {
      setError(result.error || "Mot de passe incorrect");
      setIsLoading(false);
    }
  }

return (
    <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col items-center justify-center px-4 bg-[radial-gradient(ellipse_at_50%_0%,#2d1b5e_0%,#1a0e2e_50%)] text-white">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-3xl font-bold">Acc&egrave;s r&eacute;serv&eacute;</h1>
        <p className="mb-6 text-center text-gray-300">
          Entrez le mot de passe fourni pour acc&eacute;der &agrave; l&apos;application.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="sr-only">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-600 bg-gray-900/50 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
              placeholder="Mot de passe"
              autoComplete="current-password"
              disabled={isLoading}
              required
            />
          </div>

          {error && (
            <p className="text-center text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-purple-600 px-4 py-3 text-white font-medium hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "V&eacute;rification..." : "Entrer"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function EnterPage() {
  return (
    <Suspense fallback={<div className="mx-auto flex min-h-dvh max-w-[480px] flex-col items-center justify-center px-4 bg-[radial-gradient(ellipse_at_50%_0%,#2d1b5e_0%,#1a0e2e_50%)] text-white">Chargement...</div>}>
      <EnterPageContent />
    </Suspense>
  );
}