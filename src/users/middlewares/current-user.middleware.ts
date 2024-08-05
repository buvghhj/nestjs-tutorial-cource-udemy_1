import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request } from "express";
import { Response } from "supertest";
import { UsersService } from "../users.service";
import { UserEntity } from "../entities/user.entity";

declare global {

    namespace Express {

        interface Request {

            currentUser?: UserEntity

        }

    }

}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {

    constructor(private readonly userService: UsersService) { }

    async use(req: Request, res: Response, next: NextFunction) {

        const { userId } = req.session || {}

        if (userId) {

            const user = await this.userService.findUser(userId)

            req.currentUser = user

        }

        next()

    }

}