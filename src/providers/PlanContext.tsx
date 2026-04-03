// ─── Plan Context ─────────────────────────────────────────────────────────────
// Stores the user's current subscription plan in localStorage.
// This is a lightweight stand-in until a real auth/user system exists.
// Every component that needs to know the plan (SidebarCard, Upload, Dashboard)
// reads from this single context — keeping frontend ↔ backend in sync.

import { createContext, useContext, useState, useCallback, type PropsWithChildren } from 'react';

// ─── Plan Types & Config ─────────────────────────────────────────────────────
export type PlanId = 'free' | 'basic' | 'premium' | 'enterprise';

export interface PlanConfig {
  id: PlanId;
  name: string;
  dailyUploadLimit: number;
  maxFileSizeMB: number;
}

export const PLANS: Record<PlanId, PlanConfig> = {
  free: { id: 'free', name: 'Free', dailyUploadLimit: 1, maxFileSizeMB: 100 },
  basic: { id: 'basic', name: 'Basic', dailyUploadLimit: 3, maxFileSizeMB: 200 },
  premium: { id: 'premium', name: 'Premium', dailyUploadLimit: 5, maxFileSizeMB: 500 },
  enterprise: { id: 'enterprise', name: 'Enterprise', dailyUploadLimit: 10, maxFileSizeMB: 1000 },
};

// ─── Context ─────────────────────────────────────────────────────────────────
interface PlanContextType {
  planId: PlanId;
  planConfig: PlanConfig;
  setPlan: (plan: PlanId) => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider = ({ children }: PropsWithChildren) => {
  const [planId, setPlanId] = useState<PlanId>(() => {
    const saved = localStorage.getItem('plan');
    if (saved && saved in PLANS) return saved as PlanId;
    return 'free';
  });

  const setPlan = useCallback((newPlan: PlanId) => {
    setPlanId(newPlan);
    localStorage.setItem('plan', newPlan);
  }, []);

  const planConfig = PLANS[planId];

  return (
    <PlanContext.Provider value={{ planId, planConfig, setPlan }}>{children}</PlanContext.Provider>
  );
};

export const usePlan = (): PlanContextType => {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within a PlanProvider');
  return ctx;
};
