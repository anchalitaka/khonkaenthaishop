import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateSupplierDto, UpdateSupplierDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async create(createSupplierDto: CreateSupplierDto) {
    try {
      const existing = await this.prisma.supplier.findUnique({
        where: { name: createSupplierDto.name },
      });

      if (existing) {
        throw new ConflictException('Supplier name already exists');
      }

      return await this.prisma.supplier.create({
        data: createSupplierDto,
        include: {
          _count: {
            select: { products: true },
          },
        },
      });
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.SupplierWhereInput;
    orderBy?: Prisma.SupplierOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params || {};

    const [suppliers, total] = await Promise.all([
      this.prisma.supplier.findMany({
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
      this.prisma.supplier.count({ where }),
    ]);

    return {
      data: suppliers,
      meta: {
        total,
        skip: skip || 0,
        take: take || suppliers.length,
      },
    };
  }

  async findOne(id: string) {
    const supplier = await this.prisma.supplier.findUnique({
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

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return supplier;
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    await this.findOne(id);

    if (updateSupplierDto.name) {
      const existing = await this.prisma.supplier.findUnique({
        where: { name: updateSupplierDto.name },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Supplier name already exists');
      }
    }

    return await this.prisma.supplier.update({
      where: { id },
      data: updateSupplierDto,
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.supplier.delete({
      where: { id },
    });

    return { message: `Supplier with ID ${id} deleted successfully` };
  }
}
