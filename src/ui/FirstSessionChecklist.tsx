import React from 'react';
import { useGame } from '../core/GameContext';
import {
  hasLucyOnboardingComplete,
  hasShopBeginnerCleared,
  hasTransitOnboardingComplete,
  migrateCircuitFlags
} from '../core/circuitProgression';
import '../styles/SonsotyoScenes.css';

const DEFAULT_LUCY_DETAIL = 'Briefing with Lucy at the apartment';
const DEFAULT_TRANSIT_DETAIL = "Open Transit from the apartment; finish Lucy's grid orientation.";
const DEFAULT_ANNEX_DETAIL = 'Win the Beginner Initiation bracket in the district';

export type FirstSessionChecklistPlacement = 'stacked' | 'floating';

export type FirstSessionChecklistProps = {
  placement: FirstSessionChecklistPlacement;
  /** Apartment-only copy when the VN story panel is on-screen */
  lucyStepDetail?: string;
  /** Optional override (e.g. Transit scene-specific line) */
  transitStepDetail?: string;
};

export const FirstSessionChecklist: React.FC<FirstSessionChecklistProps> = ({
  placement,
  lucyStepDetail = DEFAULT_LUCY_DETAIL,
  transitStepDetail = DEFAULT_TRANSIT_DETAIL
}) => {
  const { state } = useGame();
  const circuitFlags = migrateCircuitFlags(state.profile.progress.flags);
  if (hasShopBeginnerCleared(circuitFlags)) return null;

  const lucyDone = hasLucyOnboardingComplete(circuitFlags);
  const transitDone = hasTransitOnboardingComplete(circuitFlags);
  const annexBeginnerDone = hasShopBeginnerCleared(circuitFlags);

  const body = (
    <>
      <div className="sonsotyo-kicker">First session</div>
      <ol className="apartment-onboarding-checklist" aria-label="First session steps">
        <li
          className={`apartment-onboarding-checklist-item${lucyDone ? ' is-done' : ''}${!lucyDone ? ' is-current' : ''}`}
          aria-current={!lucyDone ? 'step' : undefined}
        >
          <span className="apartment-onboarding-step-badge" aria-hidden>
            {lucyDone ? '✓' : '1'}
          </span>
          <span className="apartment-onboarding-checklist-text">
            <span className="apartment-onboarding-checklist-label">Lucy</span>
            <span className="apartment-onboarding-checklist-detail">{lucyStepDetail}</span>
          </span>
        </li>
        <li
          className={`apartment-onboarding-checklist-item${transitDone ? ' is-done' : ''}${lucyDone && !transitDone ? ' is-current' : ''}`}
          aria-current={lucyDone && !transitDone ? 'step' : undefined}
        >
          <span className="apartment-onboarding-step-badge" aria-hidden>
            {transitDone ? '✓' : '2'}
          </span>
          <span className="apartment-onboarding-checklist-text">
            <span className="apartment-onboarding-checklist-label">Transit</span>
            <span className="apartment-onboarding-checklist-detail">{transitStepDetail}</span>
          </span>
        </li>
        <li
          className={`apartment-onboarding-checklist-item${annexBeginnerDone ? ' is-done' : ''}${lucyDone && transitDone && !annexBeginnerDone ? ' is-current' : ''}`}
          aria-current={lucyDone && transitDone && !annexBeginnerDone ? 'step' : undefined}
        >
          <span className="apartment-onboarding-step-badge" aria-hidden>
            {annexBeginnerDone ? '✓' : '3'}
          </span>
          <span className="apartment-onboarding-checklist-text">
            <span className="apartment-onboarding-checklist-label">Card Annex</span>
            <span className="apartment-onboarding-checklist-detail">{DEFAULT_ANNEX_DETAIL}</span>
          </span>
        </li>
      </ol>
      <div className="sonsotyo-caption apartment-onboarding-objective" style={{ textTransform: 'none', letterSpacing: '0.04em' }}>
        Objective: {state.currentQuest}
      </div>
    </>
  );

  if (placement === 'floating') {
    return (
      <div className="first-session-checklist-floating" aria-live="polite">
        <div className="glass-panel apartment-onboarding-rail-inner first-session-checklist-floating-card">{body}</div>
      </div>
    );
  }

  return (
    <div className="apartment-onboarding-rail apartment-onboarding-rail--stacked" aria-live="polite">
      <div className="glass-panel apartment-onboarding-rail-inner">{body}</div>
    </div>
  );
};
