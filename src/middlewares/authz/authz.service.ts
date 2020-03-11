import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'

@Injectable()
export class Authorization implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    try {
      const req = context.switchToHttp().getRequest()
      const user = req.user

      if (!user) {
        return false
      }

      if (user.roles.includes('ADMIN')) {
        req.user.isAdmin = true
      }

      return true
    } catch (error) {
      return error
    }
  }
}
