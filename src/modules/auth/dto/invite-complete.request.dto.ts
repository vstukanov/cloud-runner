export interface InviteCompleteRequestDto {
  invitationCode: string;
  password: string;
  deviceName: string;
  deviceType: string;
}

export const inviteCompleteRequestDtoSchema = {
  type: 'object',
  properties: {
    invitationCode: { type: 'string' },
    password: { type: 'string' },
    deviceName: { type: 'string' },
    deviceType: { type: 'string' },
  },
  required: ['invitationCode', 'password', 'deviceName', 'deviceType'],
};
