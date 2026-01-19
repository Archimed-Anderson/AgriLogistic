export class PhoneNumber {
  private readonly number: string;

  constructor(number: string) {
    const normalized = this.normalize(number);
    if (!this.validate(normalized)) {
      throw new Error(`Invalid phone number: ${number}`);
    }
    this.number = normalized;
  }

  private normalize(phone: string): string {
    // Remove all non-digit characters except + at the start
    return phone.replace(/(?!^\+)\D/g, '');
  }

  private validate(phone: string): boolean {
    // Validate international format: +[country code][number]
    // Minimum 8 digits, maximum 15 digits (E.164 standard)
    // Allow optional + at start
    const e164Regex = /^\+?\d{8,15}$/;
    return e164Regex.test(phone);
  }

  get value(): string {
    return this.number;
  }

  get formatted(): string {
    // Basic formatting for display
    if (this.number.startsWith('+')) {
      const countryCode = this.number.slice(0, 3);
      const rest = this.number.slice(3);
      return `${countryCode} ${rest.match(/.{1,3}/g)?.join(' ') || rest}`;
    }
    return this.number.match(/.{1,3}/g)?.join(' ') || this.number;
  }

  public equals(other: PhoneNumber): boolean {
    return this.number === other.number;
  }
}
