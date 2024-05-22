import { ConflictException, Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDirSync, exists } from 'fs-extra';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { FileErrorMessages } from './file.constants';
import * as sharp from 'sharp';

@Injectable()
export class FileService {
	private uploadDir: string;

	constructor() {
		this.uploadDir = join(path, 'uploads');
		ensureDirSync(this.uploadDir);
	}

	async writeFile(name: string, buffer: Buffer): Promise<string> {
		const path = join(this.uploadDir, name);
		const fileExist = await exists(path);
		if (fileExist) {
			throw new ConflictException(FileErrorMessages.FILE_EXIST);
		}
		await writeFile(path, buffer);
		return `/uploads/${name}`;
	}

	async toAvif(buffer: Buffer): Promise<Buffer> {
		return await sharp(buffer).avif({ quality: 75 }).toBuffer();
	}
}
