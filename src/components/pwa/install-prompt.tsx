"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "hsl-pwa-install-dismissed";
const DISMISS_MS = 1000 * 60 * 60 * 24 * 21; // 21 days

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandaloneDisplay() {
  if (typeof window === "undefined") return false;
  const media = window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone = "standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return media || iosStandalone;
}

function isIosSafari() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const webkit = /WebKit/.test(ua);
  const isChromeOrFirefox = /CriOS|FxiOS|EdgiOS/.test(ua);
  return iOS && webkit && !isChromeOrFirefox;
}

function wasRecentlyDismissed() {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const at = Number(raw);
    if (!Number.isFinite(at)) return false;
    return Date.now() - at < DISMISS_MS;
  } catch {
    return false;
  }
}

function rememberDismiss() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    // ignore storage failures
  }
}

/**
 * Subtle install nudge for Chromium (native prompt) and iOS Safari (Share tip).
 * Hidden when already installed or recently dismissed.
 */
export function PwaInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [iosTip, setIosTip] = useState(false);

  useEffect(() => {
    if (isStandaloneDisplay() || wasRecentlyDismissed()) return;

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      window.setTimeout(() => setVisible(true), 1800);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    if (isIosSafari()) {
      window.setTimeout(() => {
        setIosTip(true);
        setVisible(true);
      }, 2400);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
    };
  }, []);

  if (!visible) return null;
  if (!deferred && !iosTip) return null;

  const dismiss = () => {
    rememberDismiss();
    setVisible(false);
    setDeferred(null);
    setIosTip(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") {
      setVisible(false);
    } else {
      rememberDismiss();
      setVisible(false);
    }
    setDeferred(null);
  };

  return (
    <div
      role="region"
      aria-label="Install Homeschool Lighthouse"
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4"
    >
      <div className="mx-auto flex max-w-xl items-start gap-3 rounded-2xl border border-white/10 bg-[var(--color-navy)] p-4 text-white shadow-lg shadow-black/25">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/15 text-[var(--color-beam)]">
          <Download className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Install Homeschool Lighthouse</p>
          {iosTip && !deferred ? (
            <p className="mt-1 text-sm leading-relaxed text-slate-300">
              Tap <Share className="inline h-3.5 w-3.5 align-text-bottom text-[var(--color-beam)]" aria-hidden="true" />{" "}
              Share, then <span className="font-medium text-white">Add to Home Screen</span> for quick access.
            </p>
          ) : (
            <p className="mt-1 text-sm leading-relaxed text-slate-300">
              Add it to your home screen for faster return visits while planning.
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {deferred ? (
              <Button size="sm" onClick={install}>
                Install
              </Button>
            ) : null}
            <Button
              size="sm"
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              onClick={dismiss}
            >
              Not now
            </Button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-full p-1 text-slate-300 transition hover:bg-white/10 hover:text-white"
          aria-label="Dismiss install prompt"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
