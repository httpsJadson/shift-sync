import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { HashingServiceProtocol } from './hashing/hashing.service';
import { type ConfigType } from '@nestjs/config';
import jwtConfig from '../common/config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';


@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingServiceProtocol,
    private readonly usersService: UsersService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (user) {
      if (!user.isActive) {
        this.unauthorized();
      }
      const passwordIsValid = await this.hashingService.compare(
        loginDto.password,
        user.password,
      );
      
      if (!passwordIsValid) {
        this.unauthorized();
      }

      return this.generateTokens(user);
    } else {
      this.unauthorized();
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audi,
        issuer: this.jwtConfiguration.issuer,
      });

      const user = await this.usersService.findOne(sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found');
      }

      // Verify that provided refresh token matches persisted hash
      const stored = await this.refreshTokenRepo.findOne({ where: { user: { id: user.id } } });
      if (!stored) throw new UnauthorizedException('Refresh token revoked');

      const matches = await this.hashingService.compare(refreshTokenDto.refreshToken, stored.tokenHash);
      if (!matches) throw new UnauthorizedException('Invalid refresh token');

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getMe(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }

  private async generateTokens(user: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        },
        {
          audience: this.jwtConfiguration.audi,
          issuer: this.jwtConfiguration.issuer,
          secret: this.jwtConfiguration.secret,
          expiresIn: this.jwtConfiguration.jwtTTL,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
        },
        {
          audience: this.jwtConfiguration.audi,
          issuer: this.jwtConfiguration.issuer,
          secret: this.jwtConfiguration.secret,
          expiresIn: this.jwtConfiguration.refreshTTL,
        },
      ),
    ]);

    // persist hashed refresh token (single token per user)
    try {
      const tokenHash = await this.hashingService.hash(refreshToken);
      // remove existing tokens for user
      const existing = await this.refreshTokenRepo.find({ where: { user: { id: user.id } } });
      if (existing && existing.length) {
        await this.refreshTokenRepo.remove(existing);
      }
      const entry = this.refreshTokenRepo.create({ tokenHash, user: { id: user.id } as any });
      await this.refreshTokenRepo.save(entry);
    } catch (err) {
      // do not block login on persistence issues, but log in real app
    }

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async logout(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audi,
        issuer: this.jwtConfiguration.issuer,
      });

      const user = await this.usersService.findOne(sub);
      if (!user) throw new UnauthorizedException('User not found');

      const stored = await this.refreshTokenRepo.findOne({ where: { user: { id: user.id } } });
      if (!stored) return { loggedOut: true };

      const matches = await this.hashingService.compare(refreshTokenDto.refreshToken, stored.tokenHash);
      if (!matches) throw new UnauthorizedException('Invalid refresh token');

      await this.refreshTokenRepo.remove(stored);
      return { loggedOut: true };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private readonly unauthorized = () => {
    throw new UnauthorizedException("Invalid email or password");
  }
}
