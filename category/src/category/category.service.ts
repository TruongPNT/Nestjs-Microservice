import { Category } from './entities/category.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    public categoryRepository: Repository<Category>,
  ) {}
  async create(
    createCategoryDto: CreateCategoryDto,
    file: Express.Multer.File,
  ) {
    try {
      const path = file.path;
      const { index, name } = createCategoryDto;
      const category = await this.categoryRepository.create({
        banner: path,
        index,
        name,
      });
      if (category) await this.categoryRepository.save(category);
      return { code: 200, message: 'Category created successfully', category };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  findAll() {
    return this.categoryRepository.find({ where: { status: true } });
  }

  findOne(id: string) {
    return this.categoryRepository.findOne({
      where: { id },
    });
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    file: Express.Multer.File,
  ) {
    try {
      const category = await this.findOne(id);
      if (!category) throw new NotFoundException('Category not found');
      if (file) {
        if (fs.existsSync(category.banner)) {
          fs.unlinkSync(`./${category.banner}`);
        }
        category.banner = file.path;
      }
      const { name, index } = updateCategoryDto;
      category.name = name;
      category.index = index;
      const result = await this.categoryRepository.save(category);
      if (result)
        return { code: 200, message: 'Update category successful', category };
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: string) {
    try {
      const category = await this.findOne(id);
      if (!category) throw new NotFoundException('Category not found');
      const result = await this.categoryRepository.softRemove(category);
      if (result) return { code: 200, message: 'Delete category successful' };
    } catch (error) {
      throw new BadRequestException('Sever error');
    }
  }
}
