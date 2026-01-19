import twilio from 'twilio';

interface SMSOptions {
  to: string;
  message: string;
}

export class SMSProvider {
  private client: twilio.Twilio | null = null;
  private fromNumber: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_FROM_NUMBER || '';

    if (accountSid && authToken) {
      this.client = twilio(accountSid, authToken);
      console.log('✅ Twilio SMS provider initialized');
    } else {
      console.warn('⚠️ Twilio credentials not configured - SMS will be simulated');
    }
  }

  async send(options: SMSOptions): Promise<{ messageId: string; simulated?: boolean }> {
    if (!this.client) {
      console.log(`[SMS-SIM] To: ${options.to}, Message: ${options.message.substring(0, 50)}...`);
      return { messageId: `sms-sim-${Date.now()}`, simulated: true };
    }

    try {
      const result = await this.client.messages.create({
        to: options.to,
        from: this.fromNumber,
        body: options.message,
      });

      return { messageId: result.sid };
    } catch (error: any) {
      console.error('[SMS] Twilio error:', error.message);
      throw new Error(`SMS sending failed: ${error.message}`);
    }
  }

  async getStatus(messageId: string): Promise<string> {
    if (!this.client) return 'simulated';
    
    try {
      const message = await this.client.messages(messageId).fetch();
      return message.status;
    } catch (error) {
      return 'unknown';
    }
  }
}

export default SMSProvider;
