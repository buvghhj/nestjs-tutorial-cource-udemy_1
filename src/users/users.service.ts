import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>) { }

  async create(email: string, password: string) {

    try {

      const user = await this.userRepo.findOne({ where: { email } })

      if (user) {

        throw new BadRequestException("Email already exist")

      }

      const newUser = this.userRepo.create({ email, password })

      await this.userRepo.save(newUser)

      return newUser

    } catch (error) {

      throw error

    }

  }

  async findUser(id: number) {

    if (!id) {

      return null

    }

    const user = await this.userRepo.findOne({ where: { id } })

    if (!user) {

      throw new NotFoundException("Not found user")

    }

    return user

  }

  async findUserByEmail(email: string) {

    const users = await this.userRepo.find({ where: { email } })

    return users

  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {

    const user = await this.userRepo.findOne({ where: { id } })

    if (!user) {

      throw new NotFoundException("Not found user")

    }

    user.email = updateUserDto.email

    await this.userRepo.save(user)

    delete user.password

    return user

  }

  async removeUser(id: number) {

    const user = await this.userRepo.findOne({ where: { id } })


    if (!user) {

      throw new NotFoundException("Not found user")

    }

    await this.userRepo.remove(user)

    return { message: 'Deleted successfully!' }

  }

}
