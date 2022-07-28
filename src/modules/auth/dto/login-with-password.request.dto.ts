export interface LoginWithPasswordRequestDto {
  email: string;
  password: string;
  totp?: string;
  deviceName: string;
  deviceType: string;
}

export const loginWithPasswordRequestSchema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
    totp: { type: 'string' },
    deviceName: { type: 'string' },
    deviceType: { type: 'string' },
  },
  required: ['email', 'password', 'deviceName', 'deviceType'],
};
