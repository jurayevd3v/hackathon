import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from './models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(@InjectModel(User) private repo: typeof User) {}

  async onModuleInit() {
    const dispatchersToCreate = [
      {
        full_name: 'Dispatcher Guliston Shahar',
        username: 'dispatcher_guliston_shahar',
        address: 'Guliston shahar',
        role: UserRole.DISPATCHER,
        password: 'qwertyDev1',
      },
      {
        full_name: 'Dispatcher Guliston Tuman',
        username: 'dispatcher_guliston_tuman',
        address: 'Guliston tuman',
        role: UserRole.DISPATCHER,
        password: 'qwertyDev2',
      },
      {
        full_name: 'Dispatcher Yangiyer Shahar',
        username: 'dispatcher_yangiyer_shahar',
        address: 'Yangiyer shahar',
        role: UserRole.DISPATCHER,
        password: 'qwertyDev3',
      },
    ];

    for (const disp of dispatchersToCreate) {
      const exists = await this.repo.findOne({
        where: { username: disp.username },
      });

      if (!exists) {
        const hashedPassword = await this.hashPassword(disp.password);

        await this.repo.create({
          full_name: disp.full_name,
          username: disp.username,
          address: disp.address,
          hashed_password: hashedPassword,
          role: disp.role,
        });

        console.log(`Dispatcher yaratildi: ${disp.username}`);
      } else {
        console.log(`Dispatcher mavjud: ${disp.username}`);
      }
    }

    return { message: 'Dispatcher tekshirish tugadi' };
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 7);
    } catch {
      throw new BadRequestException('Parolni xesh qilishda xatolik yuz berdi');
    }
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.repo.findOne({
      where: { username: createUserDto.username },
    });
    if (user) {
      throw new BadRequestException(
        `Bu username "${createUserDto.username}" allaqachon mavjud!`,
      );
    }

    try {
      const hashedPassword = await this.hashPassword(createUserDto.password);
      const newUser = await this.repo.create({
        ...createUserDto,
        hashed_password: hashedPassword,
      });

      return {
        message: 'Foydalanuvchi muvaffaqiyatli yaratildi',
        user: newUser,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          'Foydalanuvchi yaratishda xatolik yuz berdi: ' + error.message,
        );
      }
      throw new BadRequestException(
        'Foydalanuvchi yaratishda nomaʼlum xatolik yuz berdi',
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

      const users = await this.repo.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.repo.count();
      const total_pages = Math.ceil(total_count / limit);

      return {
        status: 200,
        data: {
          records: users,
          pagination: { currentPage: page, total_pages, total_count },
        },
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          'Foydalanuvchilarni sahifalashda xatolik yuz berdi: ' + error.message,
        );
      }
      throw new BadRequestException(
        'Foydalanuvchilarni sahifalashda nomaʼlum xatolik yuz berdi',
      );
    }
  }

  async findOne(id: string) {
    const user = await this.repo.findByPk(id, { include: { all: true } });
    if (!user)
      throw new BadRequestException(
        `ID ${id} bo‘yicha foydalanuvchi topilmadi`,
      );
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userExists = await this.repo.findOne({
      where: { username: updateUserDto.username },
    });
    if (userExists && userExists.id !== id) {
      throw new BadRequestException(
        `Bu username "${updateUserDto.username}" allaqachon mavjud!`,
      );
    }

    const user = await this.repo.findByPk(id);
    try {
      if (!user) {
        throw new BadRequestException(
          `ID ${id} bo‘yicha foydalanuvchi topilmadi`,
        );
      }
      await user.update(updateUserDto);
      return { message: 'Foydalanuvchi muvaffaqiyatli yangilandi', user };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          'Foydalanuvchini yangilashda xatolik yuz berdi: ' + error.message,
        );
      }
      throw new BadRequestException(
        'Foydalanuvchini yangilashda nomaʼlum xatolik yuz berdi',
      );
    }
  }

  async delete(id: string) {
    const user = await this.repo.findByPk(id);
    try {
      if (!user) {
        throw new BadRequestException(
          `ID ${id} bo‘yicha foydalanuvchi topilmadi`,
        );
      }
      await this.repo.destroy({ where: { id } });
      return { message: 'Foydalanuvchi muvaffaqiyatli o‘chirildi' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          'Foydalanuvchini o‘chirishda xatolik yuz berdi: ' + error.message,
        );
      }
      throw new BadRequestException(
        'Foydalanuvchini o‘chirishda nomaʼlum xatolik yuz berdi',
      );
    }
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const { old_password, new_password } = changePasswordDto;
    const user = await this.findOne(id);

    const isOldPasswordValid = await bcrypt.compare(
      old_password,
      user.hashed_password,
    );
    if (!isOldPasswordValid)
      throw new BadRequestException('Hozirgi parol mos kelmadi!');

    try {
      const hashedPassword = await this.hashPassword(new_password);
      await this.repo.update(
        { hashed_password: hashedPassword },
        { where: { id } },
      );

      return { message: 'Parol muvaffaqiyatli o‘zgartirildi' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          'Parolni o‘zgartirishda xatolik yuz berdi: ' + error.message,
        );
      }
      throw new BadRequestException(
        'Parolni o‘zgartirishda nomaʼlum xatolik yuz berdi',
      );
    }
  }

  async resetPassword(id: string, resetPasswordDto: ResetPasswordDto) {
    const { new_password } = resetPasswordDto;
    try {
      const hashedPassword = await this.hashPassword(new_password);
      await this.repo.update(
        { hashed_password: hashedPassword },
        { where: { id } },
      );

      return { message: 'Parol muvaffaqiyatli o‘zgartirildi' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          'Parolni o‘zgartirishda xatolik yuz berdi: ' + error.message,
        );
      }
      throw new BadRequestException(
        'Parolni o‘zgartirishda nomaʼlum xatolik yuz berdi',
      );
    }
  }

  async findRole(role: string) {
    const user = await this.repo.findAll({ where: { role } });
    if (!user)
      throw new BadRequestException(
        `Role ${role} bo‘yicha foydalanuvchilar topilmadi`,
      );
    return user;
  }
}
