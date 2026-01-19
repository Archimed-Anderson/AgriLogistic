import { Entity } from './entity';
import { Email } from '../value-objects/email.vo';
import { PhoneNumber } from '../value-objects/phone-number.vo';
import { Address } from '../value-objects/address.vo';
import { Permissions } from '../value-objects/permissions.vo';
import { UserRole } from '../enums/user-role.enum';
import { BusinessType } from '../enums/business-type.enum';
import { FarmerSpecialization, LogisticsSpecialization } from '../enums/specialization.enum';

export interface UserProps {
  firstName: string;
  lastName: string;
  email: Email;
  username?: string;
  role: UserRole;
  phone?: PhoneNumber;
  address?: string;
  bio?: string;
  avatarUrl?: string | null;
  // Registration-specific fields
  businessType?: BusinessType;
  farmSize?: number; // in hectares
  farmerSpecialization?: FarmerSpecialization;
  logisticsSpecialization?: LogisticsSpecialization;
  defaultShippingAddress?: Address;
  emailVerified?: boolean;
  termsAcceptedAt?: Date;
  newsletterSubscribed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  public static create(
    props: Omit<UserProps, 'createdAt' | 'updatedAt'>,
    id?: string
  ): User {
    return new User(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id
    );
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  get email(): Email {
    return this.props.email;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get avatarUrl(): string | null {
    return this.props.avatarUrl || null;
  }

  get phone(): PhoneNumber | undefined {
    return this.props.phone;
  }

  get businessType(): BusinessType | undefined {
    return this.props.businessType;
  }

  get farmSize(): number | undefined {
    return this.props.farmSize;
  }

  get farmerSpecialization(): FarmerSpecialization | undefined {
    return this.props.farmerSpecialization;
  }

  get logisticsSpecialization(): LogisticsSpecialization | undefined {
    return this.props.logisticsSpecialization;
  }

  get defaultShippingAddress(): Address | undefined {
    return this.props.defaultShippingAddress;
  }

  get isEmailVerified(): boolean {
    return this.props.emailVerified || false;
  }

  get hasAcceptedTerms(): boolean {
    return !!this.props.termsAcceptedAt;
  }

  get isNewsletterSubscribed(): boolean {
    return this.props.newsletterSubscribed || false;
  }

  get permissions(): Permissions {
    return Permissions.forRole(this.props.role);
  }
  
  public updateProfile(
    firstName: string,
    lastName: string,
    bio?: string
  ): void {
    this.props.firstName = firstName;
    this.props.lastName = lastName;
    if (bio !== undefined) this.props.bio = bio;
    this.props.updatedAt = new Date();
  }

  public changeAvatar(url: string | null): void {
    this.props.avatarUrl = url;
    this.props.updatedAt = new Date();
  }

  public verifyEmail(): void {
    this.props.emailVerified = true;
    this.props.updatedAt = new Date();
  }

  public acceptTerms(): void {
    this.props.termsAcceptedAt = new Date();
    this.props.updatedAt = new Date();
  }

  public updateBusinessInfo(
    businessType: BusinessType,
    farmSize?: number,
    specialization?: FarmerSpecialization | LogisticsSpecialization
  ): void {
    this.props.businessType = businessType;
    if (farmSize !== undefined) this.props.farmSize = farmSize;
    
    // Type-safe specialization assignment based on role
    if (this.props.role === UserRole.FARMER && specialization) {
      this.props.farmerSpecialization = specialization as FarmerSpecialization;
    } else if (this.props.role === UserRole.TRANSPORTER && specialization) {
      this.props.logisticsSpecialization = specialization as LogisticsSpecialization;
    }
    
    this.props.updatedAt = new Date();
  }

  public setDefaultShippingAddress(address: Address): void {
    this.props.defaultShippingAddress = address;
    this.props.updatedAt = new Date();
  }

  public subscribeToNewsletter(subscribe: boolean): void {
    this.props.newsletterSubscribed = subscribe;
    this.props.updatedAt = new Date();
  }
}
