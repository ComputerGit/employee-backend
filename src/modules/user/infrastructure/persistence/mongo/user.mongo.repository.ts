import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User, UserStatus } from '../../../domain/entities/user.entity';
import { UserDocument } from './user.schema';

// MongoDB implementation of the UserRepository interface
// This handles all the transformation between domain entities and MongoDB documents
@Injectable()
export class UserMongoRepository implements UserRepository {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async deleteByUserId(employeeId: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ employeeId }).exec();
    return result.deletedCount > 0;
  }

  async save(user: User): Promise<User> {
    // Transform domain entity to MongoDB document
    const userDoc = new this.userModel({
      userId: user.id.getValue(),
      username: user.username.getValue(),
      password: user.password.getHash(),
      employeeId: user.employeeId,
      status: user.status,
      lastLoginAt: user.lastLoginAt,
    });

    const saved = await userDoc.save();

    // Transform MongoDB document back to domain entity
    return User.fromPersistence({
      id: saved.userId,
      username: saved.username,
      hashedPassword: saved.password,
      employeeId: saved.employeeId,
      status: saved.status as UserStatus,
      createdAt: saved.createdAt,
      lastLoginAt: saved.lastLoginAt,
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    const userDoc = await this.userModel.findOne({ username }).exec();

    if (!userDoc) {
      return null;
    }

    return User.fromPersistence({
      id: userDoc.userId,
      username: userDoc.username,
      hashedPassword: userDoc.password,
      employeeId: userDoc.employeeId,
      status: userDoc.status as UserStatus,
      createdAt: userDoc.createdAt,
      lastLoginAt: userDoc.lastLoginAt,
    });
  }

  async findByEmployeeId(employeeId: string): Promise<User | null> {
    const userDoc = await this.userModel.findOne({ employeeId }).exec();

    if (!userDoc) {
      return null;
    }

    return User.fromPersistence({
      id: userDoc.userId,
      username: userDoc.username,
      hashedPassword: userDoc.password,
      employeeId: userDoc.employeeId,
      status: userDoc.status as UserStatus,
      createdAt: userDoc.createdAt,
      lastLoginAt: userDoc.lastLoginAt,
    });
  }

  async existsByEmployeeId(employeeId: string): Promise<boolean> {
    const count = await this.userModel.countDocuments({ employeeId }).exec();
    return count > 0;
  }
}
