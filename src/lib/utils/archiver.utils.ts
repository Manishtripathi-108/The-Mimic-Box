import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

export const createZipFile = async (files: string[], zipFilePath: string) => {
    console.log('Creating ZIP file:', zipFilePath);

    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => resolve(zipFilePath));
        archive.on('error', (err: Error) => reject(err));

        archive.pipe(output);
        files.forEach((file) => {
            const fileName = path.basename(file);
            archive.append(fs.createReadStream(file), { name: fileName });
        });

        archive.finalize();
    });
};
