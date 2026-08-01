import { Router } from 'express';
import * as stripeWebhookController from '../controllers/stripeWebhook.controller';

const router = Router();

// OJO al montar esto en app.ts: esta ruta necesita express.raw(), NO express.json().
router.post('/stripe', stripeWebhookController.handleStripeWebhook);

export default router;
