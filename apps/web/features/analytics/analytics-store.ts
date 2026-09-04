// ============================================================
// AGRITRADE ANALYTICS STORE — Zustand
// State management for farm intelligence, time ranges, and insights
// ============================================================

'use client';

import { create } from 'zustand';
import type {
  TimeRange,
  FarmAnalyticsSnapshot,
  MarketComparison,
} from './domain/analytics';
import type { DecisionInsight } from './domain/insight';
import { MOCK_SNAPSHOTS, COMMODITY_MARKET_DATA } from './data/mock-analytics-data';
import { FarmInsightEngine } from './application/insight-engine';

interface AnalyticsState {
  timeRange: TimeRange;
  snapshot: FarmAnalyticsSnapshot;
  insights: DecisionInsight[];
  selectedInsight: DecisionInsight | null;
  selectedCommodity: string;
  marketData: MarketComparison[];

  // Actions
  setTimeRange: (range: TimeRange) => void;
  selectInsight: (insight: DecisionInsight | null) => void;
  selectCommodity: (commodity: string) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => {
  const initialRange: TimeRange = '30d';
  const initialSnapshot = MOCK_SNAPSHOTS[initialRange];
  const initialInsights = FarmInsightEngine.evaluateSnapshot(initialSnapshot);

  return {
    timeRange: initialRange,
    snapshot: initialSnapshot,
    insights: initialInsights,
    selectedInsight: null,
    selectedCommodity: 'Soybean',
    marketData: COMMODITY_MARKET_DATA,

    setTimeRange: (range: TimeRange) => {
      const newSnapshot = MOCK_SNAPSHOTS[range] || MOCK_SNAPSHOTS['30d'];
      const newInsights = FarmInsightEngine.evaluateSnapshot(newSnapshot);

      // If the currently selected insight is no longer relevant, clear it or match
      const currentSelected = get().selectedInsight;
      let nextSelected: DecisionInsight | null = null;
      if (currentSelected) {
        nextSelected = newInsights.find((i) => i.type === currentSelected.type) || null;
      }

      set({
        timeRange: range,
        snapshot: newSnapshot,
        insights: newInsights,
        selectedInsight: nextSelected,
      });
    },

    selectInsight: (insight: DecisionInsight | null) => {
      set({ selectedInsight: insight });
    },

    selectCommodity: (commodity: string) => {
      set({ selectedCommodity: commodity });
    },
  };
});
