import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt'
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
        private readonly userService: UsersService
    ) { }

    async signup(email: string, password: string) {

        try {

            const user = await this.userRepo.findOne({ where: { email } })

            if (user) {

                throw new BadRequestException("Email already exist")

            }

            const hashPassword = await bcrypt.hash(password, 10)

            const newUser = this.userRepo.create({ email, password: hashPassword })

            await this.userRepo.save(newUser)

            return newUser

        } catch (error) {

            throw error

        }

    }

    async signin(email: string, password: string) {

        try {

            const user = await this.userRepo.findOne({ where: { email } })

            if (!user) {

                throw new NotFoundException("Email is wrong")

            }

            const comparePass = await bcrypt.compare(password, user.password)

            if (!comparePass) {

                throw new BadRequestException("Password is wrong")

            }

            return user


        } catch (error) {

            throw error

        }

    }

}