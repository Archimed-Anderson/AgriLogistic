import axios from 'axios';

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';
const MARKETPLACE_API = `${PRODUCT_SERVICE_URL}/api/v1/products`;

export interface PublishOfferPayload {
  productionId: string;
  parcelName: string;
  farmerName: string;
  cropType: string;
  estimatedTonnage: number;
  region: string;
}

export async function publishOfferToMarketplace(payload: PublishOfferPayload): Promise<boolean> {
  try {
    const { data } = await axios.post(MARKETPLACE_API, {
      name: `${payload.cropType} - ${payload.parcelName}`,
      description: `Production prête à récolter - ${payload.estimatedTonnage} T estimées`,
      category: payload.cropType,
      price: 0,
      metadata: {
        productionId: payload.productionId,
        farmerName: payload.farmerName,
        region: payload.region,
        estimatedTonnage: payload.estimatedTonnage,
        source: 'production-auto-publish',
      },
    });
    return !!data?.id;
  } catch (err) {
    console.warn('Marketplace publish error:', err);
    return false;
  }
}
