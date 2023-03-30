import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

//creating a custom interceptor
export function Serialise(dto: any) {
  return UseInterceptors(new SerialiseInterceptor(dto));
}

// export class SerialiseInterceptor implements NestInterceptor {
//  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

//  }
// }
export class SerialiseInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        return plainToClass(this.dto, data, {
          // the below method makes everything work properly
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
