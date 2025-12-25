import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateUserDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, birthDate, startDate, ...rest } = createUserDto;

      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: {
          ...rest,
          password: hashedPassword,
          birthDate: birthDate ? new Date(birthDate) : undefined,
          startDate: startDate ? new Date(startDate) : undefined,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          // Personal Information
          employeeType: true,
          nationalId: true,
          titleTh: true,
          firstNameTh: true,
          lastNameTh: true,
          firstNameEn: true,
          lastNameEn: true,
          nickname: true,
          gender: true,
          bloodType: true,
          birthDate: true,
          ethnicity: true,
          nationality: true,
          religion: true,
          phone: true,
          province: true,
          maritalStatus: true,
          // Employment Information
          username: true,
          employeeId: true,
          position: true,
          positionLevel: true,
          department: true,
          employmentStatus: true,
          startDate: true,
        },
      });

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params || {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        where,
        orderBy,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          // Personal Information
          employeeType: true,
          nationalId: true,
          titleTh: true,
          firstNameTh: true,
          lastNameTh: true,
          firstNameEn: true,
          lastNameEn: true,
          nickname: true,
          gender: true,
          bloodType: true,
          birthDate: true,
          ethnicity: true,
          nationality: true,
          religion: true,
          phone: true,
          province: true,
          maritalStatus: true,
          // Employment Information
          username: true,
          employeeId: true,
          position: true,
          positionLevel: true,
          department: true,
          employmentStatus: true,
          startDate: true,
          _count: {
            select: {
              posts: true,
              comments: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        skip: skip || 0,
        take: take || users.length,
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // Personal Information
        employeeType: true,
        nationalId: true,
        titleTh: true,
        firstNameTh: true,
        lastNameTh: true,
        firstNameEn: true,
        lastNameEn: true,
        nickname: true,
        gender: true,
        bloodType: true,
        birthDate: true,
        ethnicity: true,
        nationality: true,
        religion: true,
        phone: true,
        province: true,
        maritalStatus: true,
        // Employment Information
        username: true,
        employeeId: true,
        position: true,
        positionLevel: true,
        department: true,
        employmentStatus: true,
        startDate: true,
        posts: {
          select: {
            id: true,
            title: true,
            published: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Check if user exists
    await this.findOne(id);

    const { password, birthDate, startDate, ...rest } = updateUserDto;

    const data: Prisma.UserUpdateInput = { ...rest };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    if (birthDate) {
      data.birthDate = new Date(birthDate);
    }

    if (startDate) {
      data.startDate = new Date(startDate);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // Personal Information
        employeeType: true,
        nationalId: true,
        titleTh: true,
        firstNameTh: true,
        lastNameTh: true,
        firstNameEn: true,
        lastNameEn: true,
        nickname: true,
        gender: true,
        bloodType: true,
        birthDate: true,
        ethnicity: true,
        nationality: true,
        religion: true,
        phone: true,
        province: true,
        maritalStatus: true,
        // Employment Information
        username: true,
        employeeId: true,
        position: true,
        positionLevel: true,
        department: true,
        employmentStatus: true,
        startDate: true,
      },
    });

    return user;
  }

  async remove(id: string) {
    // Check if user exists
    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: `User with ID ${id} deleted successfully` };
  }

  async validatePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}
