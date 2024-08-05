import { Test } from "@nestjs/testing"
import { UsersController } from "./users.controller"
import { UsersService } from "./users.service"
import { AuthService } from "./auth.service"
import { UserEntity } from "./entities/user.entity"
import { NotFoundException } from "@nestjs/common"

describe('UserController', () => {

    let controller: UsersController
    let fakeUserService: Partial<UsersService>
    let fakeAuthService: Partial<AuthService>

    beforeEach(async () => {

        fakeUserService = {

            findUser: (id: number) => {

                return Promise.resolve({ id: 1, email: "test@gmail.com", password: "12345678" } as UserEntity)

            },

            findUserByEmail: (email: string) => {

                return Promise.resolve([{ id: 1, email, password: "12345678" } as UserEntity])

            },

            // removeUser: () => { },

            // updateUser: () => { },

        }

        fakeAuthService = {

            // signup: () => { },

            signin: (email: string, password: string) => {

                return Promise.resolve({ id: 1, email, password } as UserEntity)

            }

        }

        const module = await Test.createTestingModule({

            controllers: [UsersController],

            providers: [
                {
                    provide: UsersService,
                    useValue: fakeUserService
                },
                {
                    provide: AuthService,
                    useValue: fakeAuthService
                }
            ]

        }).compile()

        controller = module.get<UsersController>(UsersController)

    })

    it('should be defined', () => {

        expect(controller).toBeDefined()

    })

    it('find all user returns a list of users with the given email', async () => {

        const users = await controller.findAllUsers("test@gmail.com")

        expect(users.length).toEqual(1)

        expect(users[0].email).toEqual('test@gmail.com')

    })

    it('find user return single user with the given id', async () => {

        const user = await controller.findUser(1)

        expect(user).toBeDefined()

    })

    it('find user throws an error if user with given id is not found', async () => {

        fakeUserService.findUser = () => Promise.reject(new NotFoundException("Not found user"))

        await expect(controller.findUser(1)).rejects.toThrow(NotFoundException)

    })

    it('signin updates session object and returns user', async () => {

        const session = { userId: -10 }

        const user = await controller.signin({ email: 'test@gmail.com', password: '12345678' }, session)

        expect(user.id).toEqual(1)
        expect(session.userId).toEqual(1)

    })

})