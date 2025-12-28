import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// MongoDB schema for storing user documents
// This is the persistence layer representation, separate from the domain entity
@Schema({ timestamps: true })
export class UserDocument extends Document {
  @Prop({ required: true, unique: true })
  userId: string; // UUID for the user

  @Prop({ required: true, unique: true })
  username: string; // Username (typically the employee ID)

  @Prop({ required: true })
  password: string; // Hashed password (never store plain text!)

  @Prop({ required: true, unique: true })
  employeeId: string; // Reference to the employee this user represents

  @Prop({ required: true, enum: ['PENDING', 'ACTIVE', 'SUSPENDED', 'LOCKED'] })
  status: string;

  @Prop()
  lastLoginAt?: Date;

  // Timestamps are automatically added by { timestamps: true }
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);

// Create indexes for fast lookups on username and employeeId
UserSchema.index({ username: 1 });
UserSchema.index({ employeeId: 1 });
