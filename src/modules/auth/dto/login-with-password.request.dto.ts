export interface LoginWithPasswordRequestDto {
  email: string;
  password: string;
  totp?: string;
  deviceName: string;
  deviceType: string;
}
