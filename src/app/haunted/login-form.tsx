"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Lock, Mail, KeyRound, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [mfaChallengeId, setMfaChallengeId] = useState<string | null>(null);
  const [isMfaStep, setIsMfaStep] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const allowedEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "hauntedboydip@gmail.com";
    if (email.trim().toLowerCase() !== allowedEmail.toLowerCase()) {
      setError("Access restricted. Unrecognized admin email.");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const { data: aal, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    if (!aalError && aal && aal.nextLevel === "aal2" && aal.currentLevel !== "aal2") {
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();

      if (!factorsError && factors && factors.totp && factors.totp.length > 0) {
        const factorId = factors.totp[0].id;
        const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });

        if (!challengeError && challenge) {
          setMfaFactorId(factorId);
          setMfaChallengeId(challenge.id);
          setIsMfaStep(true);
          setLoading(false);
          return;
        }
      }
    }

    window.location.href = "/haunted";
  };

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaFactorId || !mfaChallengeId) return;

    setLoading(true);
    setError("");

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: mfaFactorId,
      challengeId: mfaChallengeId,
      code: mfaCode.trim(),
    });

    if (verifyError) {
      setError("Invalid code. Please try again.");
      setLoading(false);
      return;
    }

    window.location.href = "/haunted";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative">
      {/* Theme Toggle Positioned in Top Right */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md p-8 md:p-10 rounded-2xl border border-border/80 bg-card shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/15 text-accent border border-accent/30 mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Haunted CMS
          </h1>
          <p className="text-muted-foreground text-sm">
            {isMfaStep ? "Enter your 2FA authenticator code" : "Sign in to manage your portfolio"}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl border border-red-500/40 bg-red-500/10 text-red-500 text-sm font-medium">
            {error}
          </div>
        )}

        {!isMfaStep ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-accent text-accent-foreground font-semibold text-sm hover:opacity-95 transition-opacity disabled:opacity-50 shadow-md shadow-accent/20 cursor-pointer"
            >
              {loading ? "Authenticating..." : "Sign In to CMS"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleMfaVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 text-center">
                6-Digit Authenticator Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="000000"
                required
                autoFocus
                className="w-full px-3.5 py-3 rounded-lg border border-border bg-card text-foreground text-center font-mono text-2xl tracking-widest focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>

            <button
              type="submit"
              disabled={loading || mfaCode.length < 6}
              className="w-full py-3 rounded-lg bg-accent text-accent-foreground font-semibold text-sm hover:opacity-95 transition-opacity disabled:opacity-50 shadow-md shadow-accent/20 cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMfaStep(false);
                setError("");
              }}
              className="w-full text-xs text-muted-foreground hover:text-foreground pt-2 text-center inline-flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Password
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-border/60 text-center">
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
