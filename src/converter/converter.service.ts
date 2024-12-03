import {
  BadRequestException,
  Injectable,
  StreamableFile,
  UnprocessableEntityException,
} from '@nestjs/common';
import { createReadStream, createWriteStream } from 'fs';
import * as path from 'path';
import { Transform } from 'stream';
import { pipeline } from 'node:stream/promises';
import * as parser from 'xml2json';
import { CreateConvertDocumentDto } from './dto/convert-document.dto';

@Injectable()
export class ConverterService {
  constructor() {}
  async fileConversion(
    file: Express.Multer.File,
    data: CreateConvertDocumentDto,
  ): Promise<StreamableFile> {
    const { format, lineSeparator, elementSeparator } = data;
    if (!file || !format) {
      throw new BadRequestException('Missing required parameter(s)');
    }

    if (file.mimetype === 'text/plain') {
      if (!lineSeparator || !elementSeparator) {
        throw new BadRequestException('Missing required parameter(s)');
      }
      if (lineSeparator.length !== 1 || elementSeparator.length !== 1) {
        throw new BadRequestException('Separator not in required format');
      }
    }

    // validate file type
    const allowedMimeTypes = [
      'text/plain',
      'application/xml',
      'application/json',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new UnprocessableEntityException(`Invalid File Type`);
    }

    // validate file size (using max of 5mb for now)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('file is too large!');
    }

    const readFilePath = path.join(
      __dirname,
      `./assets/upload/files/${file.filename}`,
    );

    if (format === 'string') {
      if (file.mimetype === 'text/plain') {
        throw new BadRequestException('Cannot convert to the same format.');
      }

      if (file.mimetype === 'application/json') {
        const transformFunction = this.jsonToString;
        const readStream = createReadStream(readFilePath, {
          encoding: 'utf8',
        });
        const writeFilePath = path.join(
          __dirname,
          `./assets/upload/files/${file.originalname.split(/\.(?=[^\.]+$)/)[0]}.txt`,
        );
        const writeStream = createWriteStream(writeFilePath);

        const convert = new Transform({
          objectMode: true,
          async transform(chunk, encoding, callback) {
            const transformedData = await transformFunction(chunk.toString());
            this.push(transformedData);
            callback(null);
          },
        });

        await pipeline(readStream, convert, writeStream);
        const fileName = `${file.originalname.split(/\.(?=[^\.]+$)/)[0]}.txt`;

        const t = createReadStream(writeFilePath);
        return new StreamableFile(t, {
          type: 'text/plain',
          disposition: `attachment; filename= ${fileName}`,
        });
      }

      if (file.mimetype === 'application/xml') {
        const transformFunction = this.XMLToString;
        const readStream = createReadStream(readFilePath, {
          encoding: 'utf8',
        });
        const writeFilePath = path.join(
          __dirname,
          `./assets/upload/files/${file.originalname.split(/\.(?=[^\.]+$)/)[0]}.txt`,
        );
        const writeStream = createWriteStream(writeFilePath);

        const convert = new Transform({
          objectMode: true,
          async transform(chunk, encoding, callback) {
            const transformedData = await transformFunction(chunk.toString());
            this.push(transformedData);
            callback(null);
          },
        });

        await pipeline(readStream, convert, writeStream);
        const fileName = `${file.originalname.split(/\.(?=[^\.]+$)/)[0]}.txt`;

        const t = createReadStream(writeFilePath);
        return new StreamableFile(t, {
          type: 'text/plain',
          disposition: `attachment; filename= ${fileName}`,
        });
      }
    }

    if (format === 'xml') {
      if (file.mimetype === 'application/xml') {
        throw new BadRequestException('Cannot convert to the same format.');
      }

      if (file.mimetype === 'text/plain') {
        const transformFunction = this.stringToXML;
        const readStream = createReadStream(readFilePath, {
          encoding: 'utf8',
        });
        const writeFilePath = path.join(
          __dirname,
          `./assets/upload/files/${file.originalname.split(/\.(?=[^\.]+$)/)[0]}.xml`,
        );
        const writeStream = createWriteStream(writeFilePath);

        const convert = new Transform({
          objectMode: true,
          async transform(chunk, encoding, callback) {
            const transformedData = await transformFunction(
              chunk.toString(),
              lineSeparator,
              elementSeparator,
            );
            this.push(transformedData);
            callback(null);
          },
        });

        await pipeline(readStream, convert, writeStream);
        const fileName = `${file.originalname.split(/\.(?=[^\.]+$)/)[0]}.xml`;

        const t = createReadStream(writeFilePath);
        return new StreamableFile(t, {
          type: 'application/xml',
          disposition: `attachment; filename= ${fileName}`,
        });
      }

      if (file.mimetype === 'application/json') {
        const transformFunction = this.jsonToXML;
        const readStream = createReadStream(readFilePath, {
          encoding: 'utf8',
        });
        const writeFilePath = path.join(
          __dirname,
          `./assets/upload/files/${file.originalname.split(/\.(?=[^\.]+$)/)[0]}.xml`,
        );
        const writeStream = createWriteStream(writeFilePath);

        const convert = new Transform({
          objectMode: true,
          async transform(chunk, encoding, callback) {
            const transformedData = await transformFunction(chunk.toString());
            this.push(transformedData);
            callback(null);
          },
        });

        await pipeline(readStream, convert, writeStream);
        const fileName = `${file.originalname.split(/\.(?=[^\.]+$)/)[0]}.xml`;

        const t = createReadStream(writeFilePath);
        return new StreamableFile(t, {
          type: 'application/xml',
          disposition: `attachment; filename= ${fileName}`,
        });
      }
    }
    if (format === 'json') {
      if (file.mimetype === 'application/json') {
        throw new BadRequestException('Cannot convert to the same format.');
      }

      if (file.mimetype === 'application/xml') {
        const transformFunction = this.XMLToJson;
        const readStream = createReadStream(readFilePath, {
          encoding: 'utf8',
        });
        const writeFilePath = path.join(
          __dirname,
          `./assets/upload/files/${file.originalname.split(/\.(?=[^\.]+$)/)[0]}.json`,
        );
        const writeStream = createWriteStream(writeFilePath);

        const convert = new Transform({
          objectMode: true,
          async transform(chunk, encoding, callback) {
            const transformedData = await transformFunction(chunk.toString());
            this.push(transformedData);
            callback(null);
          },
        });

        await pipeline(readStream, convert, writeStream);
        const fileName = `${file.originalname.split(/\.(?=[^\.]+$)/)[0]}.json`;

        const t = createReadStream(writeFilePath);
        return new StreamableFile(t, {
          type: 'application/json',
          disposition: `attachment; filename= ${fileName}`,
        });
      }

      if (file.mimetype === 'text/plain') {
        const transformFunction = this.stringToJson;
        const readStream = createReadStream(readFilePath, {
          encoding: 'utf8',
        });
        const writeFilePath = path.join(
          __dirname,
          `./assets/upload/files/${file.originalname.split(/\.(?=[^\.]+$)/)[0]}.json`,
        );
        const writeStream = createWriteStream(writeFilePath);

        const convert = new Transform({
          objectMode: true,
          async transform(chunk, encoding, callback) {
            const transformedData = await transformFunction(
              chunk.toString(),
              lineSeparator,
              elementSeparator,
            );
            this.push(transformedData);
            callback(null);
          },
        });

        await pipeline(readStream, convert, writeStream);
        const fileName = `${file.originalname.split(/\.(?=[^\.]+$)/)[0]}.json`;
        const t = createReadStream(writeFilePath);
        return new StreamableFile(t, {
          type: 'application/json',
          disposition: `attachment; filename= ${fileName}`,
        });
      }
    }
  }

  private async jsonToXML(data) {
    const xml = parser.toXml(data);
    return xml;
  }

  private async XMLToJson(data: string) {
    const obj = parser.toJson(data, { object: true, arrayNotation: true });
    return JSON.stringify(obj.root, null, 2);
  }

  private async XMLToString(data) {
    let cleanedData = data.split(/<root>|<\/root>/)[1];
    const lineSeparator = '~';
    const elementSeparator = '*';
    const resultArr = [];
    let finalString = '';

    const getTailTag = (data: string) => {
      const lastTagRegex = /.*<\/(.*?)>/;
      const lastTag = lastTagRegex.exec(data)[1];
      const idx = data.indexOf(lastTag);
      const result = data.substring(idx - 1);
      cleanedData = data.slice(0, idx - 1);
      return result;
    };

    while (cleanedData !== '') {
      const results = getTailTag(cleanedData);
      resultArr.push(results);
    }

    const countCharacters = (char: string, string: string): number => {
      return string.split(char).length - 1;
    };

    const reversedArr = resultArr.reverse();
    reversedArr.forEach((str) => {
      const firstTagRegex = /(?<=<)(.*?)>/;
      const firstTag = firstTagRegex.exec(str)[1];
      const numberofChildren = countCharacters(`<${firstTag}>`, str);
      if (numberofChildren > 1) {
        const lastTagRegex = /.*<\/(.*?)>/;
        const lastTag = lastTagRegex.exec(str)[1];
        str
          .split(`</${lastTag}>`)
          .filter((el: string) => el)
          .map((entry) => {
            entry.match(/>\w+</g).map((el: string, idx: number, array: []) => {
              const transformedVal = el.substring(1, el.length - 1);
              if (idx === 0) {
                finalString += `${firstTag}${elementSeparator}${transformedVal}${elementSeparator}`;
              } else if (idx === array.length - 1) {
                finalString += `${transformedVal}${lineSeparator}`;
              } else {
                finalString += `${transformedVal}${elementSeparator}`;
              }
            });
          });
      } else {
        str.match(/>\w+</g).map((el: string, idx: number, array: []) => {
          const transformedVal = el.substring(1, el.length - 1);
          if (idx === 0) {
            finalString += `${firstTag}${elementSeparator}${transformedVal}${elementSeparator}`;
          } else if (idx === array.length - 1) {
            finalString += `${transformedVal}${lineSeparator}`;
          } else {
            finalString += `${transformedVal}${elementSeparator}`;
          }
        });
      }
    });

    return finalString;
  }

  private async jsonToString(data: string) {
    const parsedData = JSON.parse(data);
    const lineSeparator = '~';
    const elementSeparator = '*';
    let finalString = ``;
    Object.entries(parsedData).forEach((entry: [string, []]) => {
      const [key, value] = entry;
      value.forEach((val) => {
        Object.values(val).forEach((item, idx, array) => {
          if (idx === 0) {
            finalString += `${key}${elementSeparator}${item}${elementSeparator}`;
          } else if (idx === array.length - 1) {
            finalString += `${item}${lineSeparator}`;
          } else {
            finalString += `${item}${elementSeparator}`;
          }
        });
      });
    });
    return finalString;
  }

  private async stringToXML(
    data: string,
    lineSeparator: string,
    elementSeparator: string,
  ) {
    const encoding = '<?xml version="1.0" encoding="UTF-8" ?>';
    const rootHead = '<root>';
    let finalXML = `${encoding}${rootHead}`;
    const rootFooter = '</root>';
    const splitLineData = data
      .trim()
      .split(lineSeparator)
      .filter((el) => el);
    for (let i = 0; i < splitLineData.length; i++) {
      splitLineData[i] = splitLineData[i].replaceAll('\n', '');
      const splitElementData = splitLineData[i]
        .trim()
        .replace(/[ ]{2,}/g, '')
        .split(elementSeparator)
        .filter((el) => el);

      const elementRoot = splitElementData[0];
      for (let j = 0; j < splitElementData.length; j++) {
        if (j === 0) {
          finalXML += `<${splitElementData[j]}>`;
        } else {
          finalXML += `<${elementRoot}${j}>${splitElementData[j]}</${elementRoot}${j}>`;
        }
      }
      finalXML += `</${elementRoot}>`;
    }
    finalXML += `${rootFooter}`;

    return finalXML;
  }

  private async stringToJson(
    data: string,
    lineSeparator: string,
    elementSeparator: string,
  ) {
    const hash = {};
    let res = {};
    const splitLineData = data
      .trim()
      .split(lineSeparator)
      .filter((el) => el);
    for (let i = 0; i < splitLineData.length; i++) {
      splitLineData[i] = splitLineData[i].replaceAll('\n', '');
      const splitElementData = splitLineData[i]
        .trim()
        .replace(/[ ]{2,}/g, '')
        .split(elementSeparator)
        .filter((el) => el);
      if (!hash[splitElementData[0]]) {
        hash[splitElementData[0]] = [];
      }
      for (let j = 1; j < splitElementData.length; j++) {
        res[`${splitElementData[0]}${j}`] = splitElementData[j];
      }
      hash[splitElementData[0]].push(res);
      res = {};
    }
    return JSON.stringify(hash);
  }
}
