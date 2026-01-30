import { Gateway, Wallets, Contract, Network } from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

interface ProductData {
  id: string;
  name: string;
  category: string;
  origin: {
    latitude: number;
    longitude: number;
    address: string;
  };
  certifications: string[];
  currentOwner: string;
  history: TraceEvent[];
  createdAt: string;
}

interface TraceEvent {
  type: string;
  description: string;
  actor: string;
  location?: { latitude: number; longitude: number; address: string };
  timestamp: string;
  data?: string;
}

let gateway: Gateway | null = null;
let network: Network | null = null;
let contract: Contract | null = null;
let simulationMode = true;
const simulatedProducts: Map<string, ProductData> = new Map();

export class BlockchainService {
  /**
   * Initialize connection to Hyperledger Fabric network
   */
  static async initialize(): Promise<boolean> {
    try {
      const ccpPath = process.env.FABRIC_CONNECTION_PROFILE || 
        path.resolve(__dirname, '../../network/connection-profile.json');

      if (!fs.existsSync(ccpPath)) {
        console.warn('⚠️ Fabric connection profile not found, running in simulation mode');
        simulationMode = true;
        return false;
      }

      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create wallet
      const walletPath = path.join(process.cwd(), 'wallet');
      const wallet = await Wallets.newFileSystemWallet(walletPath);

      // Check for admin identity
      const identity = await wallet.get('admin');
      if (!identity) {
        console.warn('⚠️ Admin identity not found in wallet, running in simulation mode');
        simulationMode = true;
        return false;
      }

      // Connect to gateway
      gateway = new Gateway();
      await gateway.connect(ccp, {
        wallet,
        identity: 'admin',
        discovery: { enabled: true, asLocalhost: true },
      });

      // Get network and contract
      network = await gateway.getNetwork(process.env.FABRIC_CHANNEL || 'AgroLogistic-channel');
      contract = network.getContract('traceability');

      simulationMode = false;
      console.log('✅ Connected to Hyperledger Fabric network');
      return true;
    } catch (error) {
      console.error('Fabric connection error:', error);
      simulationMode = true;
      return false;
    }
  }

  static isConnected(): boolean {
    return !simulationMode && contract !== null;
  }

  static async disconnect(): Promise<void> {
    if (gateway) {
      gateway.disconnect();
      console.log('Disconnected from Fabric network');
    }
  }

  /**
   * Create a new product on the blockchain
   */
  static async createProduct(
    name: string,
    category: string,
    origin: { latitude: number; longitude: number; address: string },
    owner: string
  ): Promise<{ success: boolean; productId: string }> {
    const productId = uuidv4();

    if (simulationMode) {
      const product: ProductData = {
        id: productId,
        name,
        category,
        origin,
        certifications: [],
        currentOwner: owner,
        history: [{
          type: 'CREATED',
          description: 'Product created',
          actor: owner,
          location: origin,
          timestamp: new Date().toISOString(),
        }],
        createdAt: new Date().toISOString(),
      };
      simulatedProducts.set(productId, product);
      console.log(`[Blockchain-SIM] Product created: ${productId}`);
      return { success: true, productId };
    }

    try {
      await contract!.submitTransaction(
        'CreateProduct',
        productId,
        name,
        category,
        origin.latitude.toString(),
        origin.longitude.toString(),
        origin.address
      );
      return { success: true, productId };
    } catch (error) {
      console.error('CreateProduct error:', error);
      throw error;
    }
  }

  /**
   * Record a traceability event for a product
   */
  static async recordEvent(
    productId: string,
    eventType: string,
    description: string,
    actor: string,
    location?: { latitude: number; longitude: number; address: string },
    data?: string
  ): Promise<{ success: boolean }> {
    if (simulationMode) {
      const product = simulatedProducts.get(productId);
      if (!product) throw new Error('Product not found');

      product.history.push({
        type: eventType,
        description,
        actor,
        location,
        timestamp: new Date().toISOString(),
        data,
      });
      console.log(`[Blockchain-SIM] Event recorded: ${eventType} for ${productId}`);
      return { success: true };
    }

    try {
      await contract!.submitTransaction(
        'RecordEvent',
        productId,
        eventType,
        description,
        location?.latitude.toString() || '0',
        location?.longitude.toString() || '0',
        location?.address || '',
        data || ''
      );
      return { success: true };
    } catch (error) {
      console.error('RecordEvent error:', error);
      throw error;
    }
  }

  /**
   * Get product details from blockchain
   */
  static async getProduct(productId: string): Promise<ProductData | null> {
    if (simulationMode) {
      return simulatedProducts.get(productId) || null;
    }

    try {
      const result = await contract!.evaluateTransaction('GetProduct', productId);
      return JSON.parse(result.toString());
    } catch (error) {
      console.error('GetProduct error:', error);
      return null;
    }
  }

  /**
   * Get complete traceability history for a product
   */
  static async getProductHistory(productId: string): Promise<TraceEvent[]> {
    if (simulationMode) {
      const product = simulatedProducts.get(productId);
      return product?.history || [];
    }

    try {
      const result = await contract!.evaluateTransaction('GetProductHistory', productId);
      return JSON.parse(result.toString());
    } catch (error) {
      console.error('GetProductHistory error:', error);
      return [];
    }
  }

  /**
   * Transfer product ownership
   */
  static async transferOwnership(
    productId: string,
    currentOwner: string,
    newOwner: string
  ): Promise<{ success: boolean }> {
    if (simulationMode) {
      const product = simulatedProducts.get(productId);
      if (!product) throw new Error('Product not found');
      if (product.currentOwner !== currentOwner) throw new Error('Not the current owner');

      product.currentOwner = newOwner;
      product.history.push({
        type: 'OWNERSHIP_TRANSFER',
        description: `Transferred to ${newOwner}`,
        actor: currentOwner,
        timestamp: new Date().toISOString(),
      });
      console.log(`[Blockchain-SIM] Ownership transferred: ${productId} -> ${newOwner}`);
      return { success: true };
    }

    try {
      await contract!.submitTransaction('TransferOwnership', productId, newOwner);
      return { success: true };
    } catch (error) {
      console.error('TransferOwnership error:', error);
      throw error;
    }
  }

  /**
   * Add certification to a product
   */
  static async addCertification(
    productId: string,
    certification: string,
    actor: string
  ): Promise<{ success: boolean }> {
    if (simulationMode) {
      const product = simulatedProducts.get(productId);
      if (!product) throw new Error('Product not found');

      product.certifications.push(certification);
      product.history.push({
        type: 'CERTIFICATION_ADDED',
        description: `Certification added: ${certification}`,
        actor,
        timestamp: new Date().toISOString(),
        data: certification,
      });
      console.log(`[Blockchain-SIM] Certification added: ${certification}`);
      return { success: true };
    }

    try {
      await contract!.submitTransaction('AddCertification', productId, certification);
      return { success: true };
    } catch (error) {
      console.error('AddCertification error:', error);
      throw error;
    }
  }

  /**
   * Get all products by owner
   */
  static async getProductsByOwner(owner: string): Promise<ProductData[]> {
    if (simulationMode) {
      return Array.from(simulatedProducts.values()).filter(p => p.currentOwner === owner);
    }

    try {
      const result = await contract!.evaluateTransaction('QueryProductsByOwner', owner);
      return JSON.parse(result.toString());
    } catch (error) {
      console.error('QueryProductsByOwner error:', error);
      return [];
    }
  }
}

export default BlockchainService;
