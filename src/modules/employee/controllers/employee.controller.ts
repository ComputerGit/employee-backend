import { Body, Controller, Post } from '@nestjs/common';
import { CreateEmployeeService } from '../application/services/create-employee.service';
import { CreateEmployeeDto } from '../application/dto/create-employee.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly createEmployeeService: CreateEmployeeService) {}

  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    const countryCode = 'IN'; // TEMP (later from auth context)
    return this.createEmployeeService.execute(dto, countryCode);
  }
}
