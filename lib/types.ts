// Types for enums (SQLite doesn't support native enums)

export type Plan = 'FREE' | 'PRO' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELED' | 'EXPIRED' | 'TRIALING';
export type RequestStatus = 'SUCCESS' | 'FAILED' | 'RATE_LIMITED' | 'INSUFFICIENT_CREDITS' | 'TIMEOUT';
export type ImageFormat = 'PNG' | 'JPEG' | 'WEBP';
export type ViewportType = 'DESKTOP' | 'MOBILE' | 'TABLET' | 'CUSTOM';
