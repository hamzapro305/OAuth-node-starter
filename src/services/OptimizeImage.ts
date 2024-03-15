import sharp from "sharp";
import { injectable } from "tsyringe";

@injectable()
class OptimizeImage {
    constructor() {}
    resizeImage = (
        inputBuffer: Buffer,
        width: number,
        height: number,
        quality: number
    ) => {
        return sharp(inputBuffer)
            .resize(width, height, {
                fit: "contain",
                background: {
                    alpha: 0,
                },
            })
            .toBuffer();
    };
    toPNG = (inputBuffer: Buffer, quality: number) => {
        return sharp(inputBuffer).png({ quality }).toBuffer();
    };
    toJPG = (inputBuffer: Buffer, quality: number) => {
        return sharp(inputBuffer).jpeg({ quality }).toBuffer();
    };
}

export default OptimizeImage;
