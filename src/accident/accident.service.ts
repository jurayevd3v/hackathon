import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccidentDto } from './dto/create-accident.dto';
import { UpdateAccidentDto } from './dto/update-accident.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Accident } from './models/accident.model';
import { FilesService } from '../common/files/files.service';
import { AccidentGateway } from './accident.gateway';
import { User } from '../user/models/user.model';

@Injectable()
export class AccidentService {
  constructor(
    @InjectModel(Accident) private repo: typeof Accident,
    @InjectModel(User) private repoUser: typeof User,
    private readonly fileService: FilesService,
    private readonly accidentGateway: AccidentGateway,
  ) {}

  async create(dto: CreateAccidentDto, image: Express.Multer.File) {
    let imageName: string | null = null;

    if (image) {
      try {
        imageName = await this.fileService.createFile(image);
      } catch (error) {
        console.error(error);
        throw new BadRequestException('Rasmni yuklashda xatolik yuz berdi');
      }
    }

    try {
      const accident = await this.repo.create({
        ...dto,
        image: imageName,
      });

      const dispatcher = await this.repoUser.findOne({
        where: { address: dto.address },
      });

      if (dispatcher) {
        this.accidentGateway.broadcastUpdate(dispatcher.id, accident.id);
      }

      return {
        message: 'Accident muvaffaqiyatli saqlandi',
        accident,
      };
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

  async update(id: string, dto: UpdateAccidentDto, image: Express.Multer.File) {
    try {
      const accident = await this.findOne(id);

      if (image) {
        if (accident.image) {
          try {
            await this.fileService.deleteFile(accident.image);
          } catch (error) {
            console.error('Old image delete error:', error);
          }
        }

        const imageName = this.fileService.createFile(image);
        await accident.update({ image: imageName, ...dto });
      } else {
        await accident.update(dto);
      }

      return {
        message: 'Accident muvaffaqiyatli yangilandi',
        accident,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Accidentni yangilashda xatolik yuz berdi');
    }
  }

  async delete(id: string) {
    try {
      const accident = await this.findOne(id);

      if (accident.image) {
        try {
          await this.fileService.deleteFile(accident.image);
        } catch (error) {
          console.error('Image delete error:', error);
        }
      }

      await accident.destroy();

      return {
        message: 'Accident muvaffaqiyatli o‘chirildi',
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Accidentni o‘chirishda xatolik yuz berdi');
    }
  }
}
