import sgMail from '@sendgrid/mail';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  template?: string;
  data?: Record<string, any>;
}

export class EmailProvider {
  private initialized = false;
  private templates: Map<string, Handlebars.TemplateDelegate> = new Map();

  constructor() {
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      this.initialized = true;
      this.loadTemplates();
    } else {
      console.warn('⚠️ SendGrid API key not configured - emails will be simulated');
    }
  }

  private loadTemplates(): void {
    const templatesDir = path.join(__dirname, '../templates/email');
    if (fs.existsSync(templatesDir)) {
      const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.hbs'));
      files.forEach(file => {
        const name = path.basename(file, '.hbs');
        const content = fs.readFileSync(path.join(templatesDir, file), 'utf-8');
        this.templates.set(name, Handlebars.compile(content));
      });
      console.log(`📧 Loaded ${files.length} email templates`);
    }
  }

  async send(options: EmailOptions): Promise<{ messageId: string; simulated?: boolean }> {
    let html = options.html || '';

    // Apply template if specified
    if (options.template && this.templates.has(options.template)) {
      const template = this.templates.get(options.template)!;
      html = template(options.data || {});
    }

    if (!this.initialized) {
      console.log(`[Email-SIM] To: ${options.to}, Subject: ${options.subject}`);
      return { messageId: `sim-${Date.now()}`, simulated: true };
    }

    try {
      const result = await sgMail.send({
        to: options.to,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@AgroLogistic.com',
        subject: options.subject,
        html,
        text: options.text,
      });

      return { messageId: result[0].headers['x-message-id'] || `sg-${Date.now()}` };
    } catch (error: any) {
      console.error('[Email] SendGrid error:', error.message);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }
}

export default EmailProvider;
