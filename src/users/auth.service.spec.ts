import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {

    let service: AuthService
    let fakeUserRepository: any
    let fakeUsersService: Partial<UsersService>

    beforeEach(async () => {

        const users: UserEntity[] = []

        fakeUsersService = {

            findUserByEmail: (email: string) => {

                const filteredUser = users.filter(user => user.email === email)

                return Promise.resolve(filteredUser)

            },

            create: (email: string, password: string) => {

                const user = { id: Math.floor(Math.random() * 999), email, password } as UserEntity

                users.push(user)

                return Promise.resolve(user)

            }

        }

        fakeUserRepository = {

            findOne: jest.fn(),

            create: jest.fn(),

            save: jest.fn()

        }

        const module = await Test.createTestingModule({

            providers: [

                AuthService,

                {
                    provide: UsersService,
                    useValue: fakeUsersService,
                },

                {
                    provide: getRepositoryToken(UserEntity),
                    useValue: fakeUserRepository,
                },

            ],

        }).compile()

        service = module.get<AuthService>(AuthService)

    });

    it('can create an instance of auth service', async () => {

        expect(service).toBeDefined()

    })

    it('should create a new user with a hashed password', async () => {

        const hashedPassword = await bcrypt.hash('12345678', 10);

        (fakeUserRepository.create as jest.Mock).mockReturnValue({ email: "tantest@gmail.com", password: hashedPassword })

        const user = await service.signup('tantest@gmail.com', '12345678')

        expect(user.password).not.toBe('12345678')

        expect(await bcrypt.compare('12345678', user.password)).toBe(true)

    })

    it('throws an error if user signs up with email that is in use', async () => {

        (fakeUserRepository.findOne as jest.Mock).mockResolvedValue({ email: '123@gmail.com' })

        await expect(service.signup('123@gmail.com', "12345678")).rejects.toThrow(BadRequestException)

    })

    it('throws if signin is called with an unused email', async () => {

        await expect(service.signin('123@gmail.com', "12345678")).rejects.toThrow(NotFoundException)

    })

    it('throws an error if an invalid password is provided', async () => {

        const hashedPassword = await bcrypt.hash('12345678', 10);

        (fakeUserRepository.findOne as jest.Mock).mockResolvedValue({ password: hashedPassword })

        await expect(service.signin('test@gmail.com', 'wrongpassword')).rejects.toThrow(BadRequestException);
    })

    it('returns a user if correct password is provided', async () => {

        await service.signup('test@gmail.com', '12345678')

        const hashedPassword = await bcrypt.hash('12345678', 10);

        (fakeUserRepository.findOne as jest.Mock).mockResolvedValue({ email: 'test@gmail.com', password: hashedPassword })

        const user = await service.signin('test@gmail.com', '12345678')

        expect(user).toBeDefined()

    })

});


