import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/iam/authorization/decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { Permissions } from 'src/iam/authorization/decorators/permissions.decorator';
import { UsersPermissions } from 'src/users/user.permissions';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Create role' })
  @ApiOkResponse({
    description: 'Create new role end point',
    type: String,
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all  roles' })
  @ApiOkResponse({
    description: 'Get all roles end point',
    type: String,
  })
  findAll() {
    return this.rolesService.findAll();
  }

  @Roles(Role.Admin)
  @Permissions(UsersPermissions.ShowUser)
  @Get(':id')
  @ApiOperation({ summary: 'Get single role' })
  @ApiOkResponse({
    description: 'Get single role end point',
    type: String,
  })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'update existing role' })
  @ApiOkResponse({
    description: 'update existing role end point',
    type: String,
  })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete single role' })
  @ApiOkResponse({
    description: 'delete single role end point',
    type: String,
  })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
