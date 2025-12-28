import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateEmployeeService } from '../application/services/create-employee.service';
import { CreateEmployeeDto } from '../application/dto/create-employee.dto';
import { Public, Roles } from 'src/common/decorators/roles.decorator';
import { RetrieveEmployeesService } from '../application/services/retrieve-employee.service';
@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly createEmployeeService: CreateEmployeeService,
    private readonly retrieveEmployeeService: RetrieveEmployeesService,
  ) {}

  // @Roles('ADMIN')
  @Public()
  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    const countryCode = 'IN'; // TEMP (later from auth context)
    return this.createEmployeeService.execute(dto, countryCode);
  }

  @Public()
  @Get()
  retrieveAll() {
    return this.retrieveEmployeeService.retrieveAll();
  }
}
