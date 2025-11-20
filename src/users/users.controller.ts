import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiHeader, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'Створити користувача' })
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати користувача' })
  @ApiParam({ name: "id", description: "ID користувача" })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch()
  @ApiOperation({ summary: 'Оновити дані користувача' })
  @ApiHeader({ name: "Authorization" })
  @ApiBody({ type: UpdateUserDto })
  update(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    return this.usersService.update(req.user.sub, updateUserDto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Видалити користувача' })
  @ApiHeader({ name: "Authorization (admin-only)" })
  @ApiParam({ name: "id", description: "ID користувача" })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
