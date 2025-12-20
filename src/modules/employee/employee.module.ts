import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EmployeeSequenceDocument,
  EmployeeSequenceSchema,
} from './infrastructure/persistence/mongo/employee-sequence.schema';
import { EmployeeController } from './controllers/employee.controller';
import { CreateEmployeeService } from './application/services/create-employee.service';
import { EmployeeMongoRepository } from './infrastructure/persistence/mongo/employee.mongo.repository';
import {
  EmployeeDocument,
  EmployeeSchema,
} from './infrastructure/persistence/mongo/employee.schema';
import { EmployeeIdGenerator } from './infrastructure/identity/employee-id.generator';
import { EmployeeSequenceRepository } from './infrastructure/persistence/mongo/employee-sequence.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmployeeDocument.name, schema: EmployeeSchema },
      { name: EmployeeSequenceDocument.name, schema: EmployeeSequenceSchema },
    ]),
  ],
  controllers: [EmployeeController],
  providers: [
    CreateEmployeeService,
    EmployeeSequenceRepository,
    EmployeeIdGenerator,
    {
      provide: 'EmployeeRepository',
      useClass: EmployeeMongoRepository,
    },
  ],
})
export class EmployeeModule {}
