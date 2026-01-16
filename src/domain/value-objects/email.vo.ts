export class Email {
  private readonly address: string;

  constructor(address: string) {
    if (!this.validate(address)) {
      throw new Error(`Invalid email address: ${address}`);
    }
    this.address = address;
  }

  private validate(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  get value(): string {
    return this.address;
  }

  public equals(other: Email): boolean {
    return this.address === other.address;
  }
}
