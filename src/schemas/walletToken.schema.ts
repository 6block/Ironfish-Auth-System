import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class WalletToken extends Document {
  @Prop({ required: true }) token: string;
  @Prop({ type: [String], default: [] }) addresses: string[];
  @Prop({ default: Date.now }) lastActive: Date;
}

export const WalletTokenSchema = SchemaFactory.createForClass(WalletToken);
