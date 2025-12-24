import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreatePostDto, UpdatePostDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: createPostDto,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return post;
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params || {};

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      data: posts,
      meta: {
        total,
        skip: skip || 0,
        take: take || posts.length,
      },
    };
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async findPublished(params?: { skip?: number; take?: number }) {
    return this.findAll({
      ...params,
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByAuthor(authorId: string, params?: { skip?: number; take?: number }) {
    return this.findAll({
      ...params,
      where: { authorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    // Check if post exists
    await this.findOne(id);

    const post = await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return post;
  }

  async publish(id: string) {
    return this.update(id, { published: true });
  }

  async unpublish(id: string) {
    return this.update(id, { published: false });
  }

  async remove(id: string) {
    // Check if post exists
    await this.findOne(id);

    await this.prisma.post.delete({
      where: { id },
    });

    return { message: `Post with ID ${id} deleted successfully` };
  }
}
