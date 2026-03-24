import { IsUrl } from 'class-validator';

export class GoogleAuthQueryDto {
  @IsUrl({
    require_tld: false,
  })
  redirectUri!: string;
}
