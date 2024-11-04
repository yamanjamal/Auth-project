import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = await this.prismaService.role.create({
      data: {
        name: createRoleDto.name,
      },
    });
    return role;
  }

  async findAll() {
    const roles = await this.prismaService.role.findMany();
    return roles;
  }

  async findOne(id: number) {
    const role = await this.prismaService.role.findFirst({
      where: {
        id: id,
      },
    });

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.prismaService.role.update({
      where: {
        id: id,
      },
      data: {
        name: updateRoleDto.name,
      },
    });
    return role;
  }

  async remove(id: number) {
    const role = await this.prismaService.role.delete({
      where: {
        id: id,
      },
    });
    return role;
  }
}
