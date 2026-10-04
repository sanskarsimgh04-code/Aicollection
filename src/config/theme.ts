/**
 * Global Design Tokens for A1 Collection
 * Strictly matches the specification:
 * Background: #FAFAF8
 * Card: #FFFFFF
 * Text: #171717
 * Secondary text: #6B7280
 * Border: #E5E7EB
 * Primary CTA: #111111
 * Success: #15803D
 * Error: #DC2626
 *
 * Radius:
 * Card: 14px
 * Button: 9px
 * Input: 9px
 * Image: 12px
 */

export const DESIGN_TOKENS = {
  colors: {
    background: '#FAFAF8',
    card: '#FFFFFF',
    textPrimary: '#171717',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    primaryCta: '#111111',
    primaryCtaHover: '#262626',
    primaryCtaForeground: '#FFFFFF',
    success: '#15803D',
    error: '#DC2626',
    warning: '#D97706',
    badgeAwaiting: '#FEF3C7',
    badgeAwaitingText: '#92400E',
    badgeConfirmed: '#DBEAFE',
    badgeConfirmedText: '#1E40AF',
    badgePacked: '#E0E7FF',
    badgePackedText: '#3730A3',
    badgeOutForDelivery: '#FCE7F3',
    badgeOutForDeliveryText: '#9D174D',
    badgeDelivered: '#DCFCE7',
    badgeDeliveredText: '#166534',
  },
  radius: {
    card: '14px',
    button: '9px',
    input: '9px',
    image: '12px',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
