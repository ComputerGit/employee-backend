import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controllers/user.controller';
import { UserService } from './application/services/user.service';
import {
  UserDocument,
  UserSchema,
} from './infrastructure/persistence/mongo/user.schema';
import { UserMongoRepository } from './infrastructure/persistence/mongo/user.mongo.repository';
import { EmployeeModule } from '../employee/employee.module';
import { DeleteUserService } from './application/services/delete-user.service';

@Module({
  imports: [
    // Register the User schema with Mongoose
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    // Import EmployeeModule so we can access the EmployeeRepository
    // This is necessary because UserService needs to verify employees exist
    EmployeeModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    DeleteUserService,
    {
      provide: 'UserRepository',
      useClass: UserMongoRepository,
    },
  ],
  exports: [UserService], // Export UserService so AuthModule can use it
})
export class UserModule {}
