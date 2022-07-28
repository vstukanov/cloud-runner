export interface InviteRequestDto {
  email: string;
  name: string;
}

export const inviteRequestDtoSchema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    name: { type: 'string' },
  },
  required: ['email', 'name'],
};
