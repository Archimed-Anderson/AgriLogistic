# 🚀 AgroLogistic Platform - Phase 3 Implementation Plan

## Overview
Phase 3 introduces blockchain traceability, advanced notification systems, and enhanced B2B features.

**Timeline:** Q3 2026 (12 weeks)  
**Priority:** 🟢 MEDIUM  
**Prerequisites:** Phases 1 & 2 complete

---

## 📋 Phase 3 Objectives

### Success Criteria
- ✅ Hyperledger Fabric blockchain operational
- ✅ Multi-channel notification system (Email/SMS/Push)
- ✅ Enhanced delivery service with advanced routing
- ✅ B2B marketplace features
- ✅ QdrantDB vector search for AI

---

## ⛓️ Service 1: Blockchain Service (Hyperledger Fabric)

### **Weeks 1-4: Blockchain Infrastructure**

#### 1.1 Network Architecture

```yaml
# /services/blockchain-service/network/docker-compose.yaml

version: '3.8'

networks:
  AgroLogistic-fabric:
    name: AgroLogistic-fabric

services:
  # Orderer
  orderer.AgroLogistic.com:
    container_name: orderer.AgroLogistic.com
    image: hyperledger/fabric-orderer:2.5
    environment:
      - FABRIC_LOGGING_SPEC=INFO
      - ORDERER_GENERAL_LISTENADDRESS=0.0.0.0
      - ORDERER_GENERAL_LISTENPORT=7050
      - ORDERER_GENERAL_LOCALMSPID=OrdererMSP
      - ORDERER_GENERAL_LOCALMSPDIR=/var/hyperledger/orderer/msp
      - ORDERER_GENERAL_TLS_ENABLED=true
      - ORDERER_GENERAL_TLS_PRIVATEKEY=/var/hyperledger/orderer/tls/server.key
      - ORDERER_GENERAL_TLS_CERTIFICATE=/var/hyperledger/orderer/tls/server.crt
      - ORDERER_GENERAL_TLS_ROOTCAS=[/var/hyperledger/orderer/tls/ca.crt]
      - ORDERER_GENERAL_CLUSTER_CLIENTCERTIFICATE=/var/hyperledger/orderer/tls/server.crt
      - ORDERER_GENERAL_CLUSTER_CLIENTPRIVATEKEY=/var/hyperledger/orderer/tls/server.key
      - ORDERER_GENERAL_CLUSTER_ROOTCAS=[/var/hyperledger/orderer/tls/ca.crt]
      - ORDERER_GENERAL_BOOTSTRAPMETHOD=none
      - ORDERER_CHANNELPARTICIPATION_ENABLED=true
      - ORDERER_ADMIN_TLS_ENABLED=true
      - ORDERER_ADMIN_LISTENADDRESS=0.0.0.0:7053
    working_dir: /root
    command: orderer
    volumes:
      - ../organizations/ordererOrganizations/AgroLogistic.com/orderers/orderer.AgroLogistic.com/msp:/var/hyperledger/orderer/msp
      - ../organizations/ordererOrganizations/AgroLogistic.com/orderers/orderer.AgroLogistic.com/tls:/var/hyperledger/orderer/tls
      - orderer.AgroLogistic.com:/var/hyperledger/production/orderer
    ports:
      - 7050:7050
      - 7053:7053
    networks:
      - AgroLogistic-fabric

  # Peer0 - Farmer Organization
  peer0.farmer.AgroLogistic.com:
    container_name: peer0.farmer.AgroLogistic.com
    image: hyperledger/fabric-peer:2.5
    environment:
      - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
      - CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=AgroLogistic-fabric
      - FABRIC_LOGGING_SPEC=INFO
      - CORE_PEER_TLS_ENABLED=true
      - CORE_PEER_PROFILE_ENABLED=false
      - CORE_PEER_TLS_CERT_FILE=/etc/hyperledger/fabric/tls/server.crt
      - CORE_PEER_TLS_KEY_FILE=/etc/hyperledger/fabric/tls/server.key
      - CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/tls/ca.crt
      - CORE_PEER_ID=peer0.farmer.AgroLogistic.com
      - CORE_PEER_ADDRESS=peer0.farmer.AgroLogistic.com:7051
      - CORE_PEER_LISTENADDRESS=0.0.0.0:7051
      - CORE_PEER_CHAINCODEADDRESS=peer0.farmer.AgroLogistic.com:7052
      - CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:7052
      - CORE_PEER_GOSSIP_BOOTSTRAP=peer0.farmer.AgroLogistic.com:7051
      - CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer0.farmer.AgroLogistic.com:7051
      - CORE_PEER_LOCALMSPID=FarmerMSP
      - CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/msp
      - CORE_OPERATIONS_LISTENADDRESS=peer0.farmer.AgroLogistic.com:9444
      - CORE_METRICS_PROVIDER=prometheus
      - CHAINCODE_AS_A_SERVICE_BUILDER_CONFIG={"peername":"peer0farmer"}
      - CORE_CHAINCODE_EXECUTETIMEOUT=300s
    volumes:
      - /var/run/docker.sock:/host/var/run/docker.sock
      - ../organizations/peerOrganizations/farmer.AgroLogistic.com/peers/peer0.farmer.AgroLogistic.com:/etc/hyperledger/fabric
      - peer0.farmer.AgroLogistic.com:/var/hyperledger/production
    working_dir: /root
    command: peer node start
    ports:
      - 7051:7051
      - 9444:9444
    networks:
      - AgroLogistic-fabric

  # Peer0 - Buyer Organization
  peer0.buyer.AgroLogistic.com:
    container_name: peer0.buyer.AgroLogistic.com
    image: hyperledger/fabric-peer:2.5
    environment:
      - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
      - CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=AgroLogistic-fabric
      - FABRIC_LOGGING_SPEC=INFO
      - CORE_PEER_TLS_ENABLED=true
      - CORE_PEER_TLS_CERT_FILE=/etc/hyperledger/fabric/tls/server.crt
      - CORE_PEER_TLS_KEY_FILE=/etc/hyperledger/fabric/tls/server.key
      - CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/tls/ca.crt
      - CORE_PEER_ID=peer0.buyer.AgroLogistic.com
      - CORE_PEER_ADDRESS=peer0.buyer.AgroLogistic.com:9051
      - CORE_PEER_LISTENADDRESS=0.0.0.0:9051
      - CORE_PEER_CHAINCODEADDRESS=peer0.buyer.AgroLogistic.com:9052
      - CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:9052
      - CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer0.buyer.AgroLogistic.com:9051
      - CORE_PEER_GOSSIP_BOOTSTRAP=peer0.buyer.AgroLogistic.com:9051
      - CORE_PEER_LOCALMSPID=BuyerMSP
      - CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/msp
      - CORE_OPERATIONS_LISTENADDRESS=peer0.buyer.AgroLogistic.com:9445
      - CORE_METRICS_PROVIDER=prometheus
    volumes:
      - /var/run/docker.sock:/host/var/run/docker.sock
      - ../organizations/peerOrganizations/buyer.AgroLogistic.com/peers/peer0.buyer.AgroLogistic.com:/etc/hyperledger/fabric
      - peer0.buyer.AgroLogistic.com:/var/hyperledger/production
    working_dir: /root
    command: peer node start
    ports:
      - 9051:9051
      - 9445:9445
    networks:
      - AgroLogistic-fabric

volumes:
  orderer.AgroLogistic.com:
  peer0.farmer.AgroLogistic.com:
  peer0.buyer.AgroLogistic.com:
```

#### 1.2 Smart Contract (Chaincode)

**Product Traceability Chaincode:**
```go
// /services/blockchain-service/chaincode/traceability/main.go

package main

import (
    "encoding/json"
    "fmt"
    "time"

    "github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
    contractapi.Contract
}

type Product struct {
    ID              string    `json:"id"`
    Name            string    `json:"name"`
    Category        string    `json:"category"`
    Origin          Location  `json:"origin"`
    Certifications  []string  `json:"certifications"`
    CreatedAt       time.Time `json:"createdAt"`
    CurrentOwner    string    `json:"currentOwner"`
    History         []Event   `json:"history"`
}

type Location struct {
    Latitude  float64 `json:"latitude"`
    Longitude float64 `json:"longitude"`
    Address   string  `json:"address"`
}

type Event struct {
    Type        string    `json:"type"`
    Description string    `json:"description"`
    Actor       string    `json:"actor"`
    Location    Location  `json:"location"`
    Timestamp   time.Time `json:"timestamp"`
    Data        string    `json:"data"`
}

// InitLedger initializes the ledger with sample data
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
    return nil
}

// CreateProduct creates a new product on the blockchain
func (s *SmartContract) CreateProduct(
    ctx contractapi.TransactionContextInterface,
    id string,
    name string,
    category string,
    latitude float64,
    longitude float64,
    address string,
) error {
    product := Product{
        ID:       id,
        Name:     name,
        Category: category,
        Origin: Location{
            Latitude:  latitude,
            Longitude: longitude,
            Address:   address,
        },
        CreatedAt:      time.Now(),
        CurrentOwner:   ctx.GetClientIdentity().GetID(),
        Certifications: []string{},
        History: []Event{
            {
                Type:        "CREATED",
                Description: "Product created",
                Actor:       ctx.GetClientIdentity().GetID(),
                Location: Location{
                    Latitude:  latitude,
                    Longitude: longitude,
                    Address:   address,
                },
                Timestamp: time.Now(),
            },
        },
    }

    productJSON, err := json.Marshal(product)
    if err != nil {
        return err
    }

    return ctx.GetStub().PutState(id, productJSON)
}

// RecordEvent records a new event in the product's history
func (s *SmartContract) RecordEvent(
    ctx contractapi.TransactionContextInterface,
    productID string,
    eventType string,
    description string,
    latitude float64,
    longitude float64,
    address string,
    data string,
) error {
    product, err := s.GetProduct(ctx, productID)
    if err != nil {
        return err
    }

    event := Event{
        Type:        eventType,
        Description: description,
        Actor:       ctx.GetClientIdentity().GetID(),
        Location: Location{
            Latitude:  latitude,
            Longitude: longitude,
            Address:   address,
        },
        Timestamp: time.Now(),
        Data:      data,
    }

    product.History = append(product.History, event)

    productJSON, err := json.Marshal(product)
    if err != nil {
        return err
    }

    return ctx.GetStub().PutState(productID, productJSON)
}

// TransferOwnership transfers product ownership
func (s *SmartContract) TransferOwnership(
    ctx contractapi.TransactionContextInterface,
    productID string,
    newOwner string,
) error {
    product, err := s.GetProduct(ctx, productID)
    if err != nil {
        return err
    }

    // Verify current owner
    currentOwner, _ := ctx.GetClientIdentity().GetID()
    if product.CurrentOwner != currentOwner {
        return fmt.Errorf("only current owner can transfer ownership")
    }

    product.CurrentOwner = newOwner

    event := Event{
        Type:        "OWNERSHIP_TRANSFER",
        Description: fmt.Sprintf("Ownership transferred to %s", newOwner),
        Actor:       currentOwner,
        Timestamp:   time.Now(),
    }
    product.History = append(product.History, event)

    productJSON, err := json.Marshal(product)
    if err != nil {
        return err
    }

    return ctx.GetStub().PutState(productID, productJSON)
}

// AddCertification adds a certification to the product
func (s *SmartContract) AddCertification(
    ctx contractapi.TransactionContextInterface,
    productID string,
    certification string,
) error {
    product, err := s.GetProduct(ctx, productID)
    if err != nil {
        return err
    }

    product.Certifications = append(product.Certifications, certification)

    event := Event{
        Type:        "CERTIFICATION_ADDED",
        Description: fmt.Sprintf("Certification added: %s", certification),
        Actor:       ctx.GetClientIdentity().GetID(),
        Timestamp:   time.Now(),
        Data:        certification,
    }
    product.History = append(product.History, event)

    productJSON, err := json.Marshal(product)
    if err != nil {
        return err
    }

    return ctx.GetStub().PutState(productID, productJSON)
}

// GetProduct retrieves a product from the ledger
func (s *SmartContract) GetProduct(
    ctx contractapi.TransactionContextInterface,
    id string,
) (*Product, error) {
    productJSON, err := ctx.GetStub().GetState(id)
    if err != nil {
        return nil, fmt.Errorf("failed to read from world state: %v", err)
    }
    if productJSON == nil {
        return nil, fmt.Errorf("product %s does not exist", id)
    }

    var product Product
    err = json.Unmarshal(productJSON, &product)
    if err != nil {
        return nil, err
    }

    return &product, nil
}

// GetProductHistory retrieves the complete history of a product
func (s *SmartContract) GetProductHistory(
    ctx contractapi.TransactionContextInterface,
    id string,
) ([]Event, error) {
    product, err := s.GetProduct(ctx, id)
    if err != nil {
        return nil, err
    }

    return product.History, nil
}

// QueryProductsByOwner retrieves all products owned by a specific owner
func (s *SmartContract) QueryProductsByOwner(
    ctx contractapi.TransactionContextInterface,
    owner string,
) ([]*Product, error) {
    queryString := fmt.Sprintf(`{"selector":{"currentOwner":"%s"}}`, owner)
    
    resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
    if err != nil {
        return nil, err
    }
    defer resultsIterator.Close()

    var products []*Product
    for resultsIterator.HasNext() {
        queryResponse, err := resultsIterator.Next()
        if err != nil {
            return nil, err
        }

        var product Product
        err = json.Unmarshal(queryResponse.Value, &product)
        if err != nil {
            return nil, err
        }
        products = append(products, &product)
    }

    return products, nil
}

func main() {
    chaincode, err := contractapi.NewChaincode(&SmartContract{})
    if err != nil {
        fmt.Printf("Error creating traceability chaincode: %v", err)
        return
    }

    if err := chaincode.Start(); err != nil {
        fmt.Printf("Error starting traceability chaincode: %v", err)
    }
}
```

#### 1.3 Blockchain API Service

```typescript
// /services/blockchain-service/src/api/blockchain-api.ts

import { Gateway, Wallets, Contract } from 'fabric-network';
import * as fs from 'fs';
import * as path from 'path';

export class BlockchainAPI {
  private gateway: Gateway;
  private contract: Contract | null = null;

  async connect(userId: string) {
    // Load connection profile
    const ccpPath = path.resolve(__dirname, '../../network/connection-profile.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create wallet
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check if user identity exists
    const identity = await wallet.get(userId);
    if (!identity) {
      throw new Error(`Identity for user ${userId} does not exist in wallet`);
    }

    // Connect to gateway
    this.gateway = new Gateway();
    await this.gateway.connect(ccp, {
      wallet,
      identity: userId,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get network and contract
    const network = await this.gateway.getNetwork('AgroLogistic-channel');
    this.contract = network.getContract('traceability');
  }

  async disconnect() {
    if (this.gateway) {
      this.gateway.disconnect();
    }
  }

  async createProduct(
    productId: string,
    name: string,
    category: string,
    location: { latitude: number; longitude: number; address: string }
  ) {
    if (!this.contract) throw new Error('Not connected to blockchain');

    await this.contract.submitTransaction(
      'CreateProduct',
      productId,
      name,
      category,
      location.latitude.toString(),
      location.longitude.toString(),
      location.address
    );

    return { success: true, productId };
  }

  async recordEvent(
    productId: string,
    eventType: string,
    description: string,
    location: { latitude: number; longitude: number; address: string },
    data?: string
  ) {
    if (!this.contract) throw new Error('Not connected to blockchain');

    await this.contract.submitTransaction(
      'RecordEvent',
      productId,
      eventType,
      description,
      location.latitude.toString(),
      location.longitude.toString(),
      location.address,
      data || ''
    );

    return { success: true };
  }

  async getProduct(productId: string) {
    if (!this.contract) throw new Error('Not connected to blockchain');

    const result = await this.contract.evaluateTransaction('GetProduct', productId);
    return JSON.parse(result.toString());
  }

  async getProductHistory(productId: string) {
    if (!this.contract) throw new Error('Not connected to blockchain');

    const result = await this.contract.evaluateTransaction(
      'GetProductHistory',
      productId
    );
    return JSON.parse(result.toString());
  }

  async transferOwnership(productId: string, newOwner: string) {
    if (!this.contract) throw new Error('Not connected to blockchain');

    await this.contract.submitTransaction(
      'TransferOwnership',
      productId,
      newOwner
    );

    return { success: true };
  }

  async addCertification(productId: string, certification: string) {
    if (!this.contract) throw new Error('Not connected to blockchain');

    await this.contract.submitTransaction(
      'AddCertification',
      productId,
      certification
    );

    return { success: true };
  }

  async queryProductsByOwner(owner: string) {
    if (!this.contract) throw new Error('Not connected to blockchain');

    const result = await this.contract.evaluateTransaction(
      'QueryProductsByOwner',
      owner
    );
    return JSON.parse(result.toString());
  }
}
```

---

## 📬 Service 2: Notification Service

### **Weeks 5-7: Multi-Channel Notifications**

#### 2.1 Service Structure

```
/services/notification-service/
├── src/
│   ├── channels/
│   │   ├── email/
│   │   │   ├── sendgrid.provider.ts
│   │   │   ├── ses.provider.ts
│   │   │   └── templates/
│   │   ├── sms/
│   │   │   ├── twilio.provider.ts
│   │   │   └── templates/
│   │   └── push/
│   │       ├── fcm.provider.ts
│   │       ├── apns.provider.ts
│   │       └── web-push.provider.ts
│   ├── services/
│   │   ├── notification.service.ts
│   │   ├── template.service.ts
│   │   └── preference.service.ts
│   ├── queue/
│   │   ├── notification.queue.ts
│   │   └── retry.handler.ts
│   ├── models/
│   │   ├── notification.model.ts
│   │   └── preference.model.ts
│   └── api/
│       └── notification-api.ts
├── Dockerfile
└── docker-compose.yml
```

#### 2.2 Email Service (SendGrid)

```typescript
// /services/notification-service/src/channels/email/sendgrid.provider.ts

import sgMail from '@sendgrid/mail';
import { TemplateService } from '../../services/template.service';

export class SendGridProvider {
  private templateService: TemplateService;

  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    this.templateService = new TemplateService();
  }

  async sendEmail(
    to: string,
    templateId: string,
    data: Record<string, any>,
    attachments?: Array<{ filename: string; content: Buffer; type: string }>
  ) {
    try {
      const template = await this.templateService.render(templateId, data);

      const msg = {
        to,
        from: {
          email: process.env.FROM_EMAIL || 'noreply@AgroLogistic.com',
          name: 'AgroLogistic',
        },
        subject: template.subject,
        html: template.html,
        text: template.text,
        attachments: attachments?.map(att => ({
          filename: att.filename,
          content: att.content.toString('base64'),
          type: att.type,
          disposition: 'attachment',
        })),
        tracking_settings: {
          click_tracking: { enable: true },
          open_tracking: { enable: true },
        },
        categories: [templateId, 'transactional'],
      };

      const response = await sgMail.send(msg);

      return {
        success: true,
        messageId: response[0].headers['x-message-id'],
      };
    } catch (error: any) {
      console.error('SendGrid error:', error.response?.body || error);
      throw error;
    }
  }

  async sendBulkEmail(
    recipients: string[],
    templateId: string,
    data: Record<string, any>
  ) {
    const template = await this.templateService.render(templateId, data);

    const messages = recipients.map(to => ({
      to,
      from: {
        email: process.env.FROM_EMAIL || 'noreply@AgroLogistic.com',
        name: 'AgroLogistic',
      },
      subject: template.subject,
      html: template.html,
      text: template.text,
      categories: [templateId, 'marketing'],
    }));

    try {
      const response = await sgMail.send(messages);
      return {
        success: true,
        sent: response.length,
      };
    } catch (error) {
      console.error('Bulk email error:', error);
      throw error;
    }
  }
}
```

#### 2.3 SMS Service (Twilio)

```typescript
// /services/notification-service/src/channels/sms/twilio.provider.ts

import twilio from 'twilio';

export class TwilioProvider {
  private client: twilio.Twilio;
  private fromNumber: string;

  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER!;
  }

  async sendSMS(to: string, message: string) {
    try {
      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to,
        statusCallback: `${process.env.API_URL}/webhooks/twilio/status`,
      });

      return {
        success: true,
        messageId: result.sid,
        status: result.status,
      };
    } catch (error) {
      console.error('Twilio SMS error:', error);
      throw error;
    }
  }

  async sendBulkSMS(recipients: string[], message: string) {
    const promises = recipients.map(to => this.sendSMS(to, message));
    const results = await Promise.allSettled(promises);

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return {
      total: recipients.length,
      successful,
      failed,
    };
  }

  async getMessageStatus(messageId: string) {
    const message = await this.client.messages(messageId).fetch();
    return {
      messageId: message.sid,
      status: message.status,
      errorCode: message.errorCode,
      errorMessage: message.errorMessage,
    };
  }
}
```

#### 2.4 Push Notification Service (Firebase)

```typescript
// /services/notification-service/src/channels/push/fcm.provider.ts

import * as admin from 'firebase-admin';

export class FCMProvider {
  private messaging: admin.messaging.Messaging;

  constructor() {
    const serviceAccount = require('../../../config/firebase-service-account.json');
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    this.messaging = admin.messaging();
  }

  async sendPushNotification(
    token: string,
    notification: {
      title: string;
      body: string;
      imageUrl?: string;
    },
    data?: Record<string, string>
  ) {
    try {
      const message: admin.messaging.Message = {
        token,
        notification: {
          title: notification.title,
          body: notification.body,
          imageUrl: notification.imageUrl,
        },
        data,
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            clickAction: 'FLUTTER_NOTIFICATION_CLICK',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await this.messaging.send(message);

      return {
        success: true,
        messageId: response,
      };
    } catch (error) {
      console.error('FCM error:', error);
      throw error;
    }
  }

  async sendMulticast(
    tokens: string[],
    notification: {
      title: string;
      body: string;
      imageUrl?: string;
    },
    data?: Record<string, string>
  ) {
    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.imageUrl,
      },
      data,
    };

    const response = await this.messaging.sendMulticast(message);

    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses.map(r => ({
        success: r.success,
        messageId: r.messageId,
        error: r.error?.message,
      })),
    };
  }

  async subscribeToTopic(tokens: string[], topic: string) {
    const response = await this.messaging.subscribeToTopic(tokens, topic);
    
    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  }

  async sendToTopic(
    topic: string,
    notification: {
      title: string;
      body: string;
    },
    data?: Record<string, string>
  ) {
    const message: admin.messaging.Message = {
      topic,
      notification,
      data,
    };

    const response = await this.messaging.send(message);
    
    return {
      success: true,
      messageId: response,
    };
  }
}
```

#### 2.5 Notification Queue & Retry

```typescript
// /services/notification-service/src/queue/notification.queue.ts

import Bull from 'bull';
import { SendGridProvider } from '../channels/email/sendgrid.provider';
import { TwilioProvider } from '../channels/sms/twilio.provider';
import { FCMProvider } from '../channels/push/fcm.provider';

interface NotificationJob {
  type: 'email' | 'sms' | 'push';
  recipient: string;
  template?: string;
  message?: string;
  data?: Record<string, any>;
}

export class NotificationQueue {
  private queue: Bull.Queue<NotificationJob>;
  private emailProvider: SendGridProvider;
  private smsProvider: TwilioProvider;
  private pushProvider: FCMProvider;

  constructor() {
    this.queue = new Bull('notifications', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    });

    this.emailProvider = new SendGridProvider();
    this.smsProvider = new TwilioProvider();
    this.pushProvider = new FCMProvider();

    this.setupProcessors();
  }

  private setupProcessors() {
    this.queue.process(async (job) => {
      const { type, recipient, template, message, data } = job.data;

      try {
        switch (type) {
          case 'email':
            if (!template) throw new Error('Email template required');
            return await this.emailProvider.sendEmail(
              recipient,
              template,
              data || {}
            );

          case 'sms':
            if (!message) throw new Error('SMS message required');
            return await this.smsProvider.sendSMS(recipient, message);

          case 'push':
            if (!data?.title || !data?.body) {
              throw new Error('Push notification title and body required');
            }
            return await this.pushProvider.sendPushNotification(
              recipient,
              {
                title: data.title,
                body: data.body,
                imageUrl: data.imageUrl,
              },
              data
            );

          default:
            throw new Error(`Unknown notification type: ${type}`);
        }
      } catch (error) {
        console.error(`Notification failed (${type}):`, error);
        throw error;
      }
    });

    // Handle failed jobs
    this.queue.on('failed', (job, error) => {
      console.error(`Job ${job.id} failed:`, error);
      
      // Log to monitoring system
      // Send alert if critical notification
    });

    // Handle completed jobs
    this.queue.on('completed', (job, result) => {
      console.log(`Job ${job.id} completed:`, result);
    });
  }

  async addNotification(notification: NotificationJob, priority?: number) {
    return this.queue.add(notification, {
      priority: priority || 0,
    });
  }

  async addBulkNotifications(notifications: NotificationJob[]) {
    return this.queue.addBulk(
      notifications.map(n => ({ data: n }))
    );
  }

  async getQueueStats() {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.queue.getWaitingCount(),
      this.queue.getActiveCount(),
      this.queue.getCompletedCount(),
      this.queue.getFailedCount(),
      this.queue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed,
    };
  }
}
```

---

## 🚚 Service 3: Enhanced Delivery Service

### **Weeks 8-10: Advanced Routing & GPS**

#### 3.1 QdrantDB Vector Search Setup

```python
# /services/delivery-service/src/vector_search/qdrant_setup.py

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

class QdrantVectorSearch:
    def __init__(self):
        self.client = QdrantClient(
            host=os.getenv('QDRANT_HOST', 'localhost'),
            port=int(os.getenv('QDRANT_PORT', 6333)),
            api_key=os.getenv('QDRANT_API_KEY')
        )
        self.collection_name = 'delivery_locations'
        self.setup_collection()
    
    def setup_collection(self):
        """Create collection for delivery locations"""
        collections = self.client.get_collections().collections
        
        if not any(c.name == self.collection_name for c in collections):
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=2,  # lat, lng coordinates
                    distance=Distance.EUCLID
                )
            )
    
    def add_delivery_location(self, delivery_id: str, lat: float, lng: float, metadata: dict):
        """Add delivery location to vector store"""
        self.client.upsert(
            collection_name=self.collection_name,
            points=[
                PointStruct(
                    id=delivery_id,
                    vector=[lat, lng],
                    payload=metadata
                )
            ]
        )
    
    def find_nearby_deliveries(self, lat: float, lng: float, limit: int = 10):
        """Find nearby deliveries using vector search"""
        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=[lat, lng],
            limit=limit
        )
        
        return [
            {
                'delivery_id': hit.id,
                'distance_km': hit.score,
                'metadata': hit.payload
            }
            for hit in results
        ]
```

#### 3.2 Google Maps Integration

```typescript
// /services/delivery-service/src/services/maps.service.ts

import { Client, LatLng } from '@googlemaps/google-maps-services-js';

export class MapsService {
  private client: Client;

  constructor() {
    this.client = new Client({});
  }

  async getOptimizedRoute(
    origin: LatLng,
    destination: LatLng,
    waypoints: LatLng[]
  ) {
    const response = await this.client.directions({
      params: {
        origin,
        destination,
        waypoints,
        optimize: true,
        key: process.env.GOOGLE_MAPS_API_KEY!,
      },
    });

    const route = response.data.routes[0];
    
    return {
      distance: route.legs.reduce((sum, leg) => sum + leg.distance.value, 0),
      duration: route.legs.reduce((sum, leg) => sum + leg.duration.value, 0),
      optimizedOrder: route.waypoint_order,
      polyline: route.overview_polyline.points,
      steps: route.legs.flatMap(leg => leg.steps.map(step => ({
        instruction: step.html_instructions,
        distance: step.distance.value,
        duration: step.duration.value,
        startLocation: step.start_location,
        endLocation: step.end_location,
      }))),
    };
  }

  async calculateETA(
    origin: LatLng,
    destination: LatLng,
    departureTime?: Date
  ) {
    const response = await this.client.distancematrix({
      params: {
        origins: [origin],
        destinations: [destination],
        departure_time: departureTime || new Date(),
        traffic_model: 'best_guess',
        key: process.env.GOOGLE_MAPS_API_KEY!,
      },
    });

    const element = response.data.rows[0].elements[0];
    
    return {
      distance_meters: element.distance.value,
      duration_seconds: element.duration.value,
      duration_in_traffic_seconds: element.duration_in_traffic?.value,
      eta: new Date(Date.now() + (element.duration_in_traffic?.value || element.duration.value) * 1000),
    };
  }

  async reverseGeocode(lat: number, lng: number) {
    const response = await this.client.reverseGeocode({
      params: {
        latlng: { lat, lng },
        key: process.env.GOOGLE_MAPS_API_KEY!,
      },
    });

    const result = response.data.results[0];
    
    return {
      formatted_address: result.formatted_address,
      city: result.address_components.find(c => c.types.includes('locality'))?.long_name,
      country: result.address_components.find(c => c.types.includes('country'))?.long_name,
      postal_code: result.address_components.find(c => c.types.includes('postal_code'))?.long_name,
    };
  }
}
```

---

## ✅ Phase 3 Success Criteria

**Technical:**
- Blockchain transactions <3s confirmation time
- Email delivery rate >98%
- SMS delivery rate >95%
- Push notification delivery rate >90%
- GPS tracking updates every 5s
- Route optimization reduces delivery time by >15%

**Business:**
- Blockchain adoption by >50% of premium sellers
- Notification open rates >25%
- Customer satisfaction with traceability >4.5/5
- Delivery efficiency improvement >20%

---

**Last Updated:** January 2026  
**Version:** 1.0  
**Status:** 🟢 Ready for Implementation
