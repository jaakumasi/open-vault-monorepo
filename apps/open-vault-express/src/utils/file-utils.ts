import { readFile } from 'fs';

export const readFileBuffer = async (filepath: string) => {
    try {
        readFile(filepath, (err, data) => {
            if (err)
                return new Error('Failed to read file')
            return data;
        })
    } catch (error) {
        throw new Error(`Failed to read file: ${error.message}`);
    }
};
