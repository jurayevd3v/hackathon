import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePowerDto } from './dto/create-power.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Power } from './models/power.model';
import { User } from '../user/models/user.model';
import { PowerGateway } from './power.gateway';

@Injectable()
export class PowerService {
  constructor(
    @InjectModel(Power) private repo: typeof Power,
    @InjectModel(User) private repoUser: typeof User,
    private readonly powerGateway: PowerGateway,
  ) {}

  async create(dto: CreatePowerDto) {
    try {
      if (dto.status) {
        const power = await this.repo.create({
          address: 'Guliston shahar',
          powerTime: '2 soat 25 daqiqa',
          note: 'Elektir quvati ochdi',
        });

        const dispatcher = await this.repoUser.findOne({
          where: { address: power.address },
        });

        if (dispatcher) {
          console.log(
            `socket yuborildi - Dispatcher ID ${dispatcher.id} | Power ID ${power.id}`,
          );
          this.powerGateway.broadcastUpdate(dispatcher.id, power.id);
        }

        return {
          message: 'Power muvaffaqiyatli yaratildi',
          power,
        };
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          'Power yaratishda xatolik yuz berdi: ' + error.message,
        );
      }
      throw new BadRequestException(
        'Power yaratishda nomaʼlum xatolik yuz berdi',
      );
    }
  }

  async findAll() {
    return await this.repo.findAll();
  }

  async paginate(page: number) {
    try {
      const limit = 15;
      const offset = (Number(page) - 1) * limit;

      const powers = await this.repo.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.repo.count();
      const total_pages = Math.ceil(total_count / limit);

      return {
        status: 200,
        data: {
          records: powers,
          pagination: { currentPage: page, total_pages, total_count },
        },
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          'Power sahifalashda xatolik yuz berdi: ' + error.message,
        );
      }
      throw new BadRequestException(
        'Power sahifalashda nomaʼlum xatolik yuz berdi',
      );
    }
  }

  async findOne(id: string) {
    const power = await this.repo.findByPk(id, { include: { all: true } });
    if (!power)
      throw new BadRequestException(`ID ${id} bo‘yicha power topilmadi`);
    return power;
  }
}
