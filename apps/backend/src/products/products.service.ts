import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma';
import { StorageService } from '../storage';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async create(createProductDto: CreateProductDto, file?: Express.Multer.File) {
    try {
      // Check if SKU already exists
      const existing = await this.prisma.product.findUnique({
        where: { sku: createProductDto.sku },
      });

      if (existing) {
        throw new ConflictException('Product SKU already exists');
      }

      // Check if barcode already exists (if provided)
      if (createProductDto.barcode) {
        const existingBarcode = await this.prisma.product.findUnique({
          where: { barcode: createProductDto.barcode },
        });

        if (existingBarcode) {
          throw new ConflictException('Product barcode already exists');
        }
      }

      let imageUrl: string | undefined;

      // Upload image if provided
      if (file) {
        imageUrl = await this.storage.uploadProductImage(
          file,
          createProductDto.sku,
        );
      }

      const { expiryDate, ...rest } = createProductDto;

      const product = await this.prisma.product.create({
        data: {
          ...rest,
          expiryDate: expiryDate ? new Date(expiryDate) : undefined,
          imageUrl,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          supplier: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params || {};

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          supplier: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        skip: skip || 0,
        take: take || products.length,
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        supplier: {
          select: {
            id: true,
            name: true,
            contactPerson: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    file?: Express.Multer.File,
  ) {
    const existingProduct = await this.findOne(id);

    // Check SKU uniqueness if SKU is being updated
    if (updateProductDto.sku && updateProductDto.sku !== existingProduct.sku) {
      const skuExists = await this.prisma.product.findUnique({
        where: { sku: updateProductDto.sku },
      });

      if (skuExists) {
        throw new ConflictException('Product SKU already exists');
      }
    }

    // Check barcode uniqueness if barcode is being updated
    if (
      updateProductDto.barcode &&
      updateProductDto.barcode !== existingProduct.barcode
    ) {
      const barcodeExists = await this.prisma.product.findUnique({
        where: { barcode: updateProductDto.barcode },
      });

      if (barcodeExists) {
        throw new ConflictException('Product barcode already exists');
      }
    }

    let imageUrl = existingProduct.imageUrl;

    // Upload new image if provided
    if (file) {
      // Delete old image if exists
      if (existingProduct.imageUrl) {
        await this.storage.deleteProductImage(existingProduct.imageUrl);
      }

      imageUrl = await this.storage.uploadProductImage(
        file,
        updateProductDto.sku || existingProduct.sku,
      );
    }

    const { expiryDate, ...rest } = updateProductDto;

    const data: Prisma.ProductUpdateInput = {
      ...rest,
      imageUrl,
    };

    if (expiryDate) {
      data.expiryDate = new Date(expiryDate);
    }

    const product = await this.prisma.product.update({
      where: { id },
      data,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return product;
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    // Delete image if exists
    if (product.imageUrl) {
      await this.storage.deleteProductImage(product.imageUrl);
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: `Product with ID ${id} deleted successfully` };
  }

  async findByCategory(
    categoryId: string,
    params?: {
      skip?: number;
      take?: number;
    },
  ) {
    return this.findAll({
      ...params,
      where: { categoryId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySupplier(
    supplierId: string,
    params?: {
      skip?: number;
      take?: number;
    },
  ) {
    return this.findAll({
      ...params,
      where: { supplierId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
