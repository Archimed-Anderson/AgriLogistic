import { OAuth2Client } from 'google-auth-library';

export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export class OAuth2Service {
  private googleClient: OAuth2Client | null = null;
  private isConfigured: boolean = false;

  constructor() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (clientId && clientSecret && redirectUri) {
      this.googleClient = new OAuth2Client(clientId, clientSecret, redirectUri);
      this.isConfigured = true;
    } else {
      console.warn('⚠️  Google OAuth2 credentials not configured. OAuth2 features will be disabled.');
      this.isConfigured = false;
    }
  }

  /**
   * Check if OAuth2 is configured
   */
  isOAuth2Configured(): boolean {
    return this.isConfigured;
  }

  /**
   * Get Google OAuth2 authorization URL
   */
  getGoogleAuthUrl(): string {
    if (!this.isConfigured || !this.googleClient) {
      throw new Error('Google OAuth2 is not configured');
    }

    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];

    return this.googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    });
  }

  /**
   * Exchange Google authorization code for tokens
   */
  async exchangeGoogleCode(code: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
  }> {
    if (!this.isConfigured || !this.googleClient) {
      throw new Error('Google OAuth2 is not configured');
    }

    try {
      const { tokens } = await this.googleClient.getToken(code);

      if (!tokens.access_token) {
        throw new Error('No access token received from Google');
      }

      return {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || undefined,
        expiresIn: tokens.expiry_date ? Math.floor((tokens.expiry_date - Date.now()) / 1000) : 3600,
      };
    } catch (error) {
      throw new Error(`Failed to exchange Google code: ${error}`);
    }
  }

  /**
   * Get Google user info from access token
   */
  async getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    if (!this.isConfigured || !this.googleClient) {
      throw new Error('Google OAuth2 is not configured');
    }

    try {
      this.googleClient.setCredentials({ access_token: accessToken });

      const userInfoResponse = await fetch(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch Google user info');
      }

      const userInfo = await userInfoResponse.json();
      return userInfo as GoogleUserInfo;
    } catch (error) {
      throw new Error(`Failed to get Google user info: ${error}`);
    }
  }

  /**
   * Verify Google ID token
   */
  async verifyGoogleIdToken(idToken: string): Promise<GoogleUserInfo> {
    if (!this.isConfigured || !this.googleClient) {
      throw new Error('Google OAuth2 is not configured');
    }

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new Error('Invalid ID token payload');
      }

      return {
        id: payload.sub,
        email: payload.email!,
        verified_email: payload.email_verified || false,
        name: payload.name || '',
        given_name: payload.given_name || '',
        family_name: payload.family_name || '',
        picture: payload.picture || '',
      };
    } catch (error) {
      throw new Error(`Failed to verify Google ID token: ${error}`);
    }
  }

  /**
   * Refresh Google access token
   */
  async refreshGoogleToken(refreshToken: string): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    if (!this.isConfigured || !this.googleClient) {
      throw new Error('Google OAuth2 is not configured');
    }

    try {
      this.googleClient.setCredentials({ refresh_token: refreshToken });
      const { credentials } = await this.googleClient.refreshAccessToken();

      if (!credentials.access_token) {
        throw new Error('No access token received from refresh');
      }

      return {
        accessToken: credentials.access_token,
        expiresIn: credentials.expiry_date ? Math.floor((credentials.expiry_date - Date.now()) / 1000) : 3600,
      };
    } catch (error) {
      throw new Error(`Failed to refresh Google token: ${error}`);
    }
  }
}
