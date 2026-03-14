export type TenantType = 'SCHOOL' | 'PRIVATE_TUTOR';

export type SubscriptionPlan =
  | 'FREE_TRIAL'
  | 'TUTOR_BASIC'
  | 'TUTOR_PRO'
  | 'SCHOOL_BASIC'
  | 'SCHOOL_PRO'
  | 'ENTERPRISE';

export interface TenantSettings {
  theme?: string;
  language?: string;
  features?: string[];
}
