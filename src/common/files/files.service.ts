import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { resolve, extname, join } from 'path';
import { access, mkdir, unlink, writeFile } from 'fs/promises';

@Injectable()
export class FilesService {
  async createFile(file: Express.Multer.File): Promise<string> {
    try {
      const ext = extname(file.originalname);
      const fileName = uuidv4() + ext;
      const uploadPath = resolve(__dirname, '..', '..', '..', 'uploads');

      // Upload papka mavjudligini tekshirish
      try {
        await access(uploadPath);
      } catch {
        await mkdir(uploadPath, { recursive: true });
      }

      await writeFile(join(uploadPath, fileName), file.buffer);
      return fileName;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Rasmni saqlashda xatolik!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      const filePath = resolve(
        __dirname,
        '..',
        '..',
        '..',
        'uploads',
        fileName,
      );
      await unlink(filePath);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "Rasmni o'chirishda xatolik!",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
