import {
    IsOptional,
    IsString,
} from 'class-validator';

export class BookUploadDto {
    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    author: string;

    @IsString()
    @IsOptional()
    description: string;
}
