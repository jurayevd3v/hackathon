import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccidentDto } from './dto/create-accident.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Accident } from './models/accident.model';
import { AccidentGateway } from './accident.gateway';
import { User } from '../user/models/user.model';

@Injectable()
export class AccidentService {
  constructor(
    @InjectModel(Accident) private repo: typeof Accident,
    @InjectModel(User) private repoUser: typeof User,
    private readonly accidentGateway: AccidentGateway,
  ) {}

  async create(dto: CreateAccidentDto) {
    try {
      if (dto.status) {
        const accident = await this.repo.create({
          address: 'Guliston shahar',
          status: "og'ir",
          note: 'Avto halokat yuz berdi!',
        });

        const dispatcher = await this.repoUser.findOne({
          where: { address: accident.address },
        });

        if (dispatcher) {
          console.log(
            `socket yuborildi - Dispatcher ID ${dispatcher.id} | Accident ID ${accident.id}`,
          );
          this.accidentGateway.broadcastUpdate(dispatcher.id, accident.id);
        }

        return {
          message: 'Accident muvaffaqiyatli saqlandi',
          accident,
        };
      }
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Accident saqlashda xatolik yuz berdi');
    }
  }

  async findAll() {
    try {
      const accidents = await this.repo.findAll({
        order: [['createdAt', 'DESC']],
      });
      return {
        message: 'Barcha accidentlar muvaffaqiyatli olindi',
        accidents,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Accidentlarni olishda xatolik yuz berdi');
    }
  }

  async paginate(page: number) {
    try {
      const limit = 10;
      const offset = (page - 1) * limit;

      const accidents = await this.repo.findAll({
        include: { all: true },
        order: [['createdAt', 'DESC']],
        offset,
        limit,
      });

      const total_count = await this.repo.count();
      const total_pages = Math.ceil(total_count / limit);

      return {
        message: 'Accidentlar sahifalab muvaffaqiyatli olindi',
        data: {
          records: accidents,
          pagination: {
            currentPage: page,
            total_pages,
            total_count,
          },
        },
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Accidentlarni olishda xatolik yuz berdi');
    }
  }

  async findOne(id: string) {
    try {
      const accident = await this.repo.findByPk(id);

      if (!accident) {
        throw new NotFoundException(`ID ${id} bo‘yicha accident topilmadi`);
      }

      return accident;
    } catch (error) {
      console.error(error);
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException('Accidentni olishda xatolik yuz berdi');
    }
  }
}
