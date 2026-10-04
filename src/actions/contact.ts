import { contactFormSchema, ContactFormInput } from '@/lib/validations/product';
import { ActionResponse } from './types';
import { logger } from '@/lib/logger';
import { sanitizeObject } from '@/lib/security/sanitize';

export async function submitContactForm(
  input: ContactFormInput
): Promise<ActionResponse<{ messageId: string }>> {
  try {
    const validated = contactFormSchema.parse(input);
    const sanitized = sanitizeObject(validated);

    logger.info('Contact inquiry received', {
      module: 'ContactAction',
      senderEmail: sanitized.email,
      subject: sanitized.subject,
    });

    const messageId = `msg_${Date.now()}`;

    return {
      success: true,
      data: { messageId },
    };
  } catch (error: any) {
    logger.error('Failed to submit contact form', error);
    return {
      success: false,
      error: {
        message: error.message || 'Validation failed for contact inquiry',
        code: 'CONTACT_SUBMIT_ERROR',
        details: error.issues,
      },
    };
  }
}
