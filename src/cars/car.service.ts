import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Car } from './models/car.model';
import { FilesService } from '../common/files/files.service';

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car) private repo: typeof Car,
    private readonly fileService: FilesService,
  ) {}

  async create(
    createCarDto: CreateCarDto,
    imageOne?: Express.Multer.File,
    imageTwo?: Express.Multer.File,
  ) {
    let imageNameOne: string | null = null;
    let imageNameTwo: string | null = null;

    if (imageOne) {
      try {
        imageNameOne = await this.fileService.createFile(imageOne);
      } catch (error) {
        console.error(error);
        throw new BadRequestException('Rasmni yuklashda xatolik yuz berdi');
      }
    }

    if (imageTwo) {
      try {
        imageNameTwo = await this.fileService.createFile(imageTwo);
      } catch (error) {
        console.error(error);
        throw new BadRequestException('Rasmni yuklashda xatolik yuz berdi');
      }
    }

    try {
      const carEntity = this.repo.create({
        ...createCarDto,
        imageOne: imageNameOne,
        imageTwo: imageNameTwo,
      });

      return {
        message: 'Car muvaffaqiyatli yaratildi',
        car: carEntity,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Car yaratishda xatolik yuz berdi');
    }
  }

  async findAll() {
    try {
      const cars = await this.repo.findAll({
        order: [['createdAt', 'DESC']],
      });
      return {
        message: 'Barcha carlar muvaffaqiyatli olindi',
        cars,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Carlarni olishda xatolik yuz berdi');
    }
  }

  async paginate(page: number) {
    try {
      const limit = 10;
      const offset = (page - 1) * limit;

      const cars = await this.repo.findAll({
        include: { all: true },
        order: [['createdAt', 'DESC']],
        offset,
        limit,
      });

      const total_count = await this.repo.count();
      const total_pages = Math.ceil(total_count / limit);

      return {
        message: 'Carlar sahifalab muvaffaqiyatli olindi',
        data: {
          records: cars,
          pagination: {
            currentPage: page,
            total_pages,
            total_count,
          },
        },
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Carlarni olishda xatolik yuz berdi');
    }
  }

  async findOne(id: string) {
    try {
      const car = await this.repo.findByPk(id);

      if (!car) {
        throw new NotFoundException(`ID ${id} bo‘yicha car topilmadi`);
      }

      return car;
    } catch (error) {
      console.error(error);
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException('Carni olishda xatolik yuz berdi');
    }
  }

  async findKey(key: string) {
    try {
      const car = await this.repo.findOne({ where: { key } });

      if (!car) {
        throw new NotFoundException(`Key ${key} bo‘yicha car topilmadi`);
      }

      return car;
    } catch (error) {
      console.error(error);
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException('Carni olishda xatolik yuz berdi');
    }
  }

  async update(
    id: string,
    updateCarDto: UpdateCarDto,
    imageOne?: Express.Multer.File,
    imageTwo?: Express.Multer.File,
  ) {
    try {
      const car = await this.findOne(id);

      if (!car) {
        throw new BadRequestException('Car topilmadi');
      }

      if (imageOne) {
        if (car.imageOne) {
          try {
            await this.fileService.deleteFile(car.imageOne);
          } catch (error) {
            console.error('Old imageOne delete error:', error);
          }
        }
        car.imageOne = await this.fileService.createFile(imageOne);
      }

      if (imageTwo) {
        if (car.imageTwo) {
          try {
            await this.fileService.deleteFile(car.imageTwo);
          } catch (error) {
            console.error('Old imageTwo delete error:', error);
          }
        }
        car.imageTwo = await this.fileService.createFile(imageTwo);
      }

      const updatedCar = await car.update({
        ...updateCarDto,
        imageOne: car.imageOne,
        imageTwo: car.imageTwo,
      });

      return {
        message: 'Car muvaffaqiyatli yangilandi',
        car: updatedCar,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Car yangilashda xatolik yuz berdi');
    }
  }

  async delete(id: string) {
    try {
      const car = await this.findOne(id);

      if (car.imageOne) {
        try {
          await this.fileService.deleteFile(car.imageOne);
        } catch (error) {
          console.error('Image one delete error:', error);
        }
      }

      if (car.imageTwo) {
        try {
          await this.fileService.deleteFile(car.imageTwo);
        } catch (error) {
          console.error('Image two delete error:', error);
        }
      }

      await car.destroy();

      return {
        message: 'Car muvaffaqiyatli o‘chirildi',
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Carni o‘chirishda xatolik yuz berdi');
    }
  }
}
