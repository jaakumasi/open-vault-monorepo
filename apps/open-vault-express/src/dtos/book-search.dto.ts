import { IsDefined, IsString } from 'class-validator';

export class BookSearchDto {
  @IsString()
  @IsDefined({message: 'No query provided'})
  query: string;
}
