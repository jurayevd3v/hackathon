import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFineDto } from './dto/create-fine.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Fine } from './models/fine.model';
import { User } from '../user/models/user.model';
import { FineGateway } from './fine.gateway';

@Injectable()
export class FineService {
  constructor(
    @InjectModel(Fine) private repo: typeof Fine,
    @InjectModel(User) private repoUser: typeof User,
    private readonly fineGateway: FineGateway,
  ) {}

  async create(dto: CreateFineDto) {
    try {
      if (dto.status) {
        const addresses = ['Guliston shahar'];
        const address = addresses[Math.floor(Math.random() * addresses.length)];

        const names = [
          'Qizilda o‘tdi',
          'Tezlikni oshirdi',
          'Notog‘ri parkovka',
          'Yuk cheklovini buzdi',
          'Tosh yo‘lda xavfli manevr',
        ];
        const name = names[Math.floor(Math.random() * names.length)];

        const regions = ['20'];
        const region = regions[Math.floor(Math.random() * regions.length)];
        const carNumber = `${region}A${Math.floor(1000 + Math.random() * 9000)}AA`;

        const notes = [
          'Svetafor qizil bo‘lishiga qaramay o‘tgan',
          'Ruxsat etilgan tezlikni oshirgan',
          'Notog‘ri joyda to‘xtagan',
          'Masofa saqlamagan',
          'Tartibga rioya qilmagan',
        ];
        const note = notes[Math.floor(Math.random() * notes.length)];

        const fine = await this.repo.create({
          address,
          name,
          carNumber,
          note,
        });

        const dispatcher = await this.repoUser.findOne({
          where: { address: fine.address },
        });

        if (dispatcher) {
          this.fineGateway.broadcastUpdate(dispatcher.id, fine.id);
        }

        return {
          message: 'Fine muvaffaqiyatli yaratildi',
          fine,
        };
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          'Fine yaratishda xatolik yuz berdi: ' + error.message,
        );
      }
      throw new BadRequestException(
        'Fine yaratishda nomaʼlum xatolik yuz berdi',
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

      const fines = await this.repo.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.repo.count();
      const total_pages = Math.ceil(total_count / limit);

      return {
        status: 200,
        data: {
          records: fines,
          pagination: { currentPage: page, total_pages, total_count },
        },
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          'Fine sahifalashda xatolik yuz berdi: ' + error.message,
        );
      }
      throw new BadRequestException(
        'Fine sahifalashda nomaʼlum xatolik yuz berdi',
      );
    }
  }

  async findOne(id: string) {
    const fine = await this.repo.findByPk(id, { include: { all: true } });
    if (!fine)
      throw new BadRequestException(`ID ${id} bo‘yicha fine topilmadi`);
    return fine;
  }
}
