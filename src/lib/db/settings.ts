import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/status';
import { recordAuditLog } from '@/lib/audit';
import { assertServerAdmin } from '@/lib/auth/rbac';
import { logger } from '@/lib/logger';
import { PaymentMode } from '@/config/site';

export interface StoreSettings {
  storeProfile: {
    name: string;
    tagline: string;
    currency: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
  checkoutConfig: {
    mode: PaymentMode;
    requirePhone: boolean;
    preferredChannels: string[];
    autoNotifyOwner: boolean;
  };
  shippingConfig: {
    defaultFee: number;
    freeShippingThreshold: number;
    localDeliveryAvailable: boolean;
    pickupAvailable: boolean;
    timeSlots: string[];
  };
  taxConfig: {
    ratePercent: number;
    pricesIncludeTax: boolean;
    taxLabel: string;
  };
  homepageConfig: {
    heroHeading: string;
    heroSubheading: string;
    showAnnouncement: boolean;
    announcementText: string;
  };
  seoDefaults: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
  };
}

// In-memory defaults fallback when database is not yet connected
const DEFAULT_BUSINESS_SETTINGS: StoreSettings = {
  storeProfile: {
    name: 'A1 Collection',
    tagline: 'Curated Elegance, Crafted for Your Lifestyle',
    currency: 'USD',
  },
  contactInfo: {
    phone: '+1 (555) 019-2834',
    email: 'hello@a1collection.com',
    address: '142 Artisan Boulevard, Suite 10, Downtown',
    hours: 'Mon - Sat: 10:00 AM - 8:00 PM | Sun: 12:00 PM - 6:00 PM',
  },
  checkoutConfig: {
    mode: (process.env.PAYMENT_MODE as PaymentMode) || 'MANUAL_CONFIRMATION',
    requirePhone: true,
    preferredChannels: ['whatsapp', 'phone', 'email'],
    autoNotifyOwner: true,
  },
  shippingConfig: {
    defaultFee: 0,
    freeShippingThreshold: 0,
    localDeliveryAvailable: true,
    pickupAvailable: true,
    timeSlots: [
      'Morning (10 AM - 1 PM)',
      'Afternoon (2 PM - 6 PM)',
      'Evening (6 PM - 8 PM)',
      'Workshop Pickup',
    ],
  },
  taxConfig: {
    ratePercent: 0,
    pricesIncludeTax: true,
    taxLabel: 'Local Sales Tax',
  },
  homepageConfig: {
    heroHeading: 'Curated Elegance, Crafted for Your Lifestyle.',
    heroSubheading: 'We personally inspect, pack, and manually confirm every single order with you to ensure perfection.',
    showAnnouncement: true,
    announcementText: 'Local shop exclusive • Personalized manual order confirmation on all orders • Handcrafted with care',
  },
  seoDefaults: {
    metaTitle: 'A1 Collection - Premium Local Shop',
    metaDescription: 'A1 Collection is a premium local-shop e-commerce destination featuring curated collections, handcrafted goods, and personalized manual order confirmation.',
    ogImage: '/og-image.jpg',
  },
};

/**
 * Retrieves all business settings from the database or returns fallback defaults.
 */
export async function getStoreSettings(): Promise<StoreSettings> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_BUSINESS_SETTINGS;
  }

  try {
    const client = getSupabaseAdminClient() || getSupabaseBrowserClient();
    if (!client) return DEFAULT_BUSINESS_SETTINGS;

    const { data, error } = await (client.from('settings') as any).select('*');
    if (error || !data || data.length === 0) {
      return DEFAULT_BUSINESS_SETTINGS;
    }

    const map = new Map(data.map((row: any) => [row.key, row.value]));

    return {
      storeProfile: (map.get('store_profile') as any) || DEFAULT_BUSINESS_SETTINGS.storeProfile,
      contactInfo: (map.get('contact_info') as any) || DEFAULT_BUSINESS_SETTINGS.contactInfo,
      checkoutConfig: (map.get('checkout_configuration') as any) || DEFAULT_BUSINESS_SETTINGS.checkoutConfig,
      shippingConfig: (map.get('shipping_configuration') as any) || DEFAULT_BUSINESS_SETTINGS.shippingConfig,
      taxConfig: (map.get('tax_configuration') as any) || DEFAULT_BUSINESS_SETTINGS.taxConfig,
      homepageConfig: (map.get('homepage_configuration') as any) || DEFAULT_BUSINESS_SETTINGS.homepageConfig,
      seoDefaults: (map.get('seo_defaults') as any) || DEFAULT_BUSINESS_SETTINGS.seoDefaults,
    };
  } catch (err) {
    logger.error('Failed to load store settings from database', err);
    return DEFAULT_BUSINESS_SETTINGS;
  }
}

/**
 * Updates a business setting. Strictly enforced server-side authorization:
 * only SUPER_ADMIN or ADMIN can update settings.
 * Writes to audit log.
 */
export async function updateStoreSetting(
  key: string,
  category: 'store' | 'contact' | 'checkout' | 'shipping' | 'tax' | 'homepage' | 'seo',
  value: Record<string, unknown>,
  adminUserId: string,
  adminEmail?: string
): Promise<void> {
  // STRICT: Verify user is SUPER_ADMIN or ADMIN
  const role = await assertServerAdmin(adminUserId, ['SUPER_ADMIN', 'ADMIN']);

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    throw new Error('Supabase admin client not initialized on server');
  }

  // Get previous value for audit diff
  const { data: previous } = await (adminClient.from('settings') as any)
    .select('value')
    .eq('key', key)
    .single();

  const { error } = await (adminClient.from('settings') as any).upsert({
    key,
    category,
    value,
    updated_by: adminUserId,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`Failed to update setting: ${error.message}`);
  }

  // Record audit log
  await recordAuditLog({
    actorId: adminUserId,
    actorEmail: adminEmail,
    actorRole: role,
    action: 'SETTING_UPDATED',
    resourceType: 'setting',
    resourceId: key,
    diff: {
      previous: previous?.value,
      next: value,
    },
  });
}
