import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { ConfigsModule } from '../../configs/configs.module';

@Module({
  imports: [
    ConfigsModule
  ],
  providers: [FirebaseService],
  exports: [FirebaseService],
})

export class FirebaseModule { }
