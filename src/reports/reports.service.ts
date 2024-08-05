import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportEntity } from './entities/report.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { GetEstiamteDto } from './dto/get-estimate.dto';

@Injectable()
export class ReportsService {

  constructor(@InjectRepository(ReportEntity) private readonly reportRepo: Repository<ReportEntity>) { }

  async getEstimate({ make, model, lng, lat, year, mileage }: GetEstiamteDto) {

    const report = await this.reportRepo.createQueryBuilder()
      .select("AVG(price)", "price")
      // .select("*")
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng = :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat = :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year = :year BETWEEN -5 AND 5', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage = :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(2)
      .getRawOne()
    // .getRawMany()

    return report

  }

  async createReport(createReportDto: CreateReportDto, user: UserEntity) {

    const report = this.reportRepo.create(createReportDto)

    report.user = user

    return this.reportRepo.save(report)

  }

  async changeApproval(id: number, approved: boolean) {

    const report = await this.reportRepo.findOne({ where: { id: id } })

    if (!report) {

      throw new NotFoundException('Report not found')

    }

    report.approved = approved

    return this.reportRepo.save(report)

  }

}
