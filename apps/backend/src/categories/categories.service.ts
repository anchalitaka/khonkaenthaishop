import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      // Check if category name already exists
      const existing = await this.prisma.category.findUnique({
        where: { name: createCategoryDto.name },
      });

      if (existing) {
        throw new ConflictException('Category name already exists');
      }

      return await this.prisma.category.create({
        data: createCategoryDto,
        include: {
          _count: {
            select: { products: true },
          },
        },
      });
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params || {};

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          _count: {
            select: { products: true },
          },
        },
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      data: categories,
      meta: {
        total,
        skip: skip || 0,
        take: take || categories.length,
      },
    };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            imageUrl: true,
          },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    // Check if category exists
    await this.findOne(id);

    // Check name uniqueness if name is being updated
    if (updateCategoryDto.name) {
      const existing = await this.prisma.category.findUnique({
        where: { name: updateCategoryDto.name },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Category name already exists');
      }
    }

    return await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async remove(id: string) {
    // Check if category exists
    await this.findOne(id);

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: `Category with ID ${id} deleted successfully` };
  }
}
