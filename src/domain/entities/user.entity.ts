import { Entity } from './entity';
import { Email } from '../value-objects/email.vo';
import { UserRole } from '../enums/user-role.enum';

export interface UserProps {
  firstName: string;
  lastName: string;
  email: Email;
  username?: string;
  role: UserRole;
  phone?: string;
  address?: string;
  bio?: string;
  avatarUrl?: string | null;
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
}
