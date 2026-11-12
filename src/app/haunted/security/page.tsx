"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SecurityPage() {
  const [factors, setFactors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const supabase = createClient();

  const loadFactors = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (!error && data) {
      setFactors(data.totp || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFactors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startEnrollment = async () => {
    setMessage(null);
    setActionLoading(true);
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      issuer: "Haunted CMS",
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
      setActionLoading(false);
      return;
    }

    if (data && data.totp) {
      setFactorId(data.id);
      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setEnrolling(true);
    }
    setActionLoading(false);
  };

  const confirmEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId) return;

    setActionLoading(true);
    setMessage(null);

    const challenge = await supabase.auth.mfa.challenge({ factorId });
    if (challenge.error) {
      setMessage({ type: "error", text: challenge.error.message });
      setActionLoading(false);
      return;
    }

    const verify = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.data.id,
      code: verifyCode.trim(),
    });

    if (verify.error) {
      setMessage({ type: "error", text: verify.error.message || "Invalid verification code." });
      setActionLoading(false);
      return;
    }

    setMessage({ type: "success", text: "Two-factor authentication successfully enabled!" });
    setEnrolling(false);
    setQrCode(null);
    setSecret(null);
    setVerifyCode("");
    await loadFactors();
    setActionLoading(false);
  };

  const unenrollFactor = async (id: string) => {
    if (!confirm("Are you sure you want to disable 2FA?")) return;

    setActionLoading(true);
    const { error } = await supabase.auth.mfa.unenroll({ factorId: id });
    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "2FA has been disabled." });
      await loadFactors();
    }
    setActionLoading(false);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8 pb-4 border-b border-border">
        <h1 className="text-3xl font-heading font-bold mb-1">Security & 2FA</h1>
        <p className="text-muted-foreground text-sm">
          Protect your CMS with two-factor authentication (TOTP) using Google Authenticator or Authy.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 mb-6 border text-sm ${
            message.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
              : "border-red-500/40 bg-red-500/10 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="p-8 border border-border text-center text-muted-foreground">
          Checking security status...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status Box */}
          <div className="border-2 border-border p-6 bg-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-heading font-bold mb-1">
                  Two-Factor Authentication (2FA)
                </h2>
                <p className="text-sm text-muted-foreground">
                  Requires a 6-digit verification code from your phone whenever signing in.
                </p>
              </div>
              <span
                className={`px-3 py-1 text-xs font-mono border ${
                  factors.length > 0
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/40"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                {factors.length > 0 ? "ENABLED" : "NOT SET UP"}
              </span>
            </div>

            {factors.length === 0 && !enrolling && (
              <div className="mt-6 pt-4 border-t border-border">
                <button
                  onClick={startEnrollment}
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm disabled:opacity-50"
                >
                  {actionLoading ? "Initializing..." : "+ Set Up Two-Factor Authentication"}
                </button>
              </div>
            )}

            {factors.length > 0 && (
              <div className="mt-6 pt-4 border-t border-border space-y-3">
                {factors.map((f) => (
                  <div key={f.id} className="flex items-center justify-between p-3 bg-muted/40 border border-border">
                    <div>
                      <div className="font-heading font-bold text-sm">
                        Authenticator App ({f.friendly_name || "TOTP"})
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        Status: Verified ({f.status})
                      </div>
                    </div>
                    <button
                      onClick={() => unenrollFactor(f.id)}
                      disabled={actionLoading}
                      className="px-3 py-1.5 border border-red-500/40 text-red-600 text-xs font-medium hover:bg-red-500/10"
                    >
                      Disable
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enrollment Modal / Form */}
          {enrolling && qrCode && (
            <div className="border-2 border-primary p-6 bg-card">
              <h3 className="text-lg font-heading font-bold mb-2">Scan QR Code</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Open Google Authenticator, Authy, or your password manager and scan the QR code below:
              </p>

              <div className="flex flex-col sm:flex-row gap-6 items-center mb-6 p-4 bg-muted/30 border border-border">
                <div className="bg-white p-3 border border-border">
                  <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Can&apos;t scan? Enter this secret manually:</p>
                  <code className="block p-2 bg-background border border-border font-mono text-xs break-all select-all">
                    {secret}
                  </code>
                </div>
              </div>

              <form onSubmit={confirmEnrollment} className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Enter the 6-digit code shown in your app:
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    required
                    placeholder="123456"
                    className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none font-mono text-xl tracking-widest text-center"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={actionLoading || verifyCode.length < 6}
                    className="px-5 py-2 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm disabled:opacity-50"
                  >
                    {actionLoading ? "Verifying..." : "Verify & Activate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEnrolling(false);
                      setQrCode(null);
                    }}
                    className="px-4 py-2 border border-border text-sm font-medium hover:bg-muted"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
