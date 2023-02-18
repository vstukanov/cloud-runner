import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceEntity, DeviceStatus, UserEntity } from '../../entities';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
  ) {}

  createRefreshToken() {
    return nanoid(21);
  }

  async createActive(user: UserEntity, { ip, name, type }) {
    const device = await this.deviceRepository
      .createQueryBuilder()
      .insert()
      .values({
        deviceId: nanoid(),
        status: DeviceStatus.ACTIVE,
        user: { id: user.id },
        ip,
        name,
        type,
        refreshToken: this.createRefreshToken(),
        createdAt: () => 'now()',
        lastLoginWith: () => 'now()',
      })
      .returning('*')
      .execute();

    return this.deviceRepository.create(device.generatedMaps[0]);
  }

  async deactivate(deviceId: string) {
    const device = await this.deviceRepository.findOneByOrFail({ deviceId });
    device.status = DeviceStatus.REVOKED;
    await this.deviceRepository.save(device);
  }

  async refresh(refreshToken: string, ip: string) {
    const device = await this.deviceRepository.findOneBy({
      refreshToken,
      status: DeviceStatus.ACTIVE,
    });

    if (!device) {
      throw new UnauthorizedException();
    }

    await this.deviceRepository.update(
      { deviceId: device.deviceId },
      {
        refreshToken: this.createRefreshToken(),
        ip,
        lastLoginWith: () => 'now()',
      },
    );

    return this.deviceRepository.findOne({
      where: {
        deviceId: device.deviceId,
      },
      relations: ['user'],
      relationLoadStrategy: 'query',
    });
  }

  async getById(deviceId) {
    return this.deviceRepository.findOneByOrFail({ deviceId });
  }
}
