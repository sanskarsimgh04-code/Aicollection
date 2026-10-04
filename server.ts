import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { manualCheckoutSchema } from './src/lib/validations/order';
import { contactFormSchema } from './src/lib/validations/product';
import { getRobotsTxt } from './src/app/robots';
import { generateSitemapXml } from './src/app/sitemap';
import { formatErrorResponse, ValidationError, NotFoundError } from './src/lib/errors';
import { logger } from './src/lib/logger';
import { SEED_PRODUCTS } from './src/actions/products';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// -----------------------------------------------------------------------------
// Health Check Endpoint
// -----------------------------------------------------------------------------
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    store: 'A1 Collection',
    paymentMode: process.env.PAYMENT_MODE || 'MANUAL_CONFIRMATION',
    timestamp: new Date().toISOString(),
  });
});

// -----------------------------------------------------------------------------
// Products API Endpoint
// -----------------------------------------------------------------------------
app.get('/api/products', (req: Request, res: Response) => {
  const { category, q, limit } = req.query;
  let items = [...SEED_PRODUCTS];

  if (category && typeof category === 'string') {
    items = items.filter((p) => p.category_id.includes(category));
  }

  if (q && typeof q === 'string') {
    const query = q.toLowerCase();
    items = items.filter((p) => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
  }

  if (limit) {
    items = items.slice(0, Number(limit));
  }

  res.json({ success: true, data: items });
});

// -----------------------------------------------------------------------------
// Manual Order Confirmation Submission Endpoint
// -----------------------------------------------------------------------------
app.post('/api/orders', (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = manualCheckoutSchema.parse(req.body);

    const subtotal = validated.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
    const orderNumber = `A1-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderId = `ord_${Date.now()}`;

    logger.info('Manual confirmation order received via API', {
      module: 'ServerOrderRoute',
      orderNumber,
      customerEmail: validated.email,
      customerPhone: validated.phone,
      total: subtotal,
    });

    res.status(201).json({
      success: true,
      data: {
        orderId,
        orderNumber,
        status: 'awaiting_confirmation',
        customer: {
          fullName: validated.fullName,
          phone: validated.phone,
          preferredContactMethod: validated.preferredContactMethod,
        },
      },
    });
  } catch (error) {
    next(new ValidationError('Invalid order submission data', error));
  }
});

// -----------------------------------------------------------------------------
// Contact Inquiries Endpoint
// -----------------------------------------------------------------------------
app.post('/api/contact', (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = contactFormSchema.parse(req.body);
    logger.info('Contact inquiry received via API', {
      module: 'ServerContactRoute',
      email: validated.email,
      subject: validated.subject,
    });

    res.status(200).json({
      success: true,
      data: { messageId: `msg_${Date.now()}` },
    });
  } catch (error) {
    next(new ValidationError('Invalid contact form input', error));
  }
});

// -----------------------------------------------------------------------------
// Dynamic robots.txt and sitemap.xml Endpoints
// -----------------------------------------------------------------------------
app.get('/robots.txt', (req: Request, res: Response) => {
  res.type('text/plain').send(getRobotsTxt());
});

app.get('/sitemap.xml', (req: Request, res: Response) => {
  res.type('application/xml').send(generateSitemapXml());
});

// -----------------------------------------------------------------------------
// Centralized API Error Handling Middleware
// -----------------------------------------------------------------------------
app.use('/api', (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('API Error occurred', err, { path: req.path });
  const formatted = formatErrorResponse(err);
  res.status(formatted.error.statusCode || 500).json(formatted);
});

// -----------------------------------------------------------------------------
// Vite Middleware / Static Asset Serving
// -----------------------------------------------------------------------------
async function bootstrapServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    logger.info(`A1 Collection foundation server running on http://localhost:${PORT}`, {
      port: PORT,
      mode: process.env.NODE_ENV || 'development',
    });
  });
}

bootstrapServer().catch((err) => {
  logger.error('Failed to start server', err);
  process.exit(1);
});
