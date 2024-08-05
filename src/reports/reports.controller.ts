import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dto/report.dto';
import { ApproveReportDto } from './dto/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstiamteDto } from './dto/get-estimate.dto';

@Controller('reports')
export class ReportsController {

    constructor(private readonly reportsService: ReportsService) { }

    @Get()
    getEstimate(@Query() getEstiamteDto: GetEstiamteDto) {

        return this.reportsService.getEstimate(getEstiamteDto)

    }

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() createReportDto: CreateReportDto, @CurrentUser() user: UserEntity) {

        return this.reportsService.createReport(createReportDto, user)

    }


    @Patch(":id")
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id: number, @Body() body: ApproveReportDto) {

        return this.reportsService.changeApproval(id, body.approved)

    }

}
