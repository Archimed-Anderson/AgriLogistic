export interface AddressProps {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  state?: string;
  complement?: string;
}

export class Address {
  private readonly props: AddressProps;

  constructor(props: AddressProps) {
    this.validate(props);
    this.props = props;
  }

  private validate(props: AddressProps): void {
    if (!props.street || props.street.trim().length === 0) {
      throw new Error('Street is required');
    }
    if (!props.city || props.city.trim().length === 0) {
      throw new Error('City is required');
    }
    if (!props.postalCode || props.postalCode.trim().length === 0) {
      throw new Error('Postal code is required');
    }
    if (!props.country || props.country.trim().length === 0) {
      throw new Error('Country is required');
    }
  }

  get street(): string {
    return this.props.street;
  }

  get city(): string {
    return this.props.city;
  }

  get postalCode(): string {
    return this.props.postalCode;
  }

  get country(): string {
    return this.props.country;
  }

  get state(): string | undefined {
    return this.props.state;
  }

  get complement(): string | undefined {
    return this.props.complement;
  }

  get formatted(): string {
    const parts = [
      this.props.street,
      this.props.complement,
      `${this.props.postalCode} ${this.props.city}`,
      this.props.state,
      this.props.country
    ].filter(Boolean);
    
    return parts.join(', ');
  }

  public toJSON(): AddressProps {
    return { ...this.props };
  }

  public equals(other: Address): boolean {
    return (
      this.props.street === other.props.street &&
      this.props.city === other.props.city &&
      this.props.postalCode === other.props.postalCode &&
      this.props.country === other.props.country
    );
  }
}
