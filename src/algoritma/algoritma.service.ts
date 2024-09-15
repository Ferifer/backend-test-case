import { Injectable } from '@nestjs/common';
import {
  CreateAlgoritma2Dto,
  CreateAlgoritma3Dto,
  CreateAlgoritma4Dto,
  CreateAlgoritmaDto,
} from './dto/create-algoritma.dto';
import { UpdateAlgoritmaDto } from './dto/update-algoritma.dto';

@Injectable()
export class AlgoritmaService {
  async questionOne(createAlgoritmaDto: CreateAlgoritmaDto) {
    const alphabetPart =
      createAlgoritmaDto.input_word.match(/[a-zA-Z]+/g)?.[0] || '';
    const numberPart = createAlgoritmaDto.input_word.match(/\d+/g)?.[0] || '';
    const reversedAlphabet = alphabetPart.split('').reverse().join('');

    return reversedAlphabet + numberPart;
  }

  async questionTwo(createAlgoritmaDto: CreateAlgoritma2Dto) {
    const longestWord = createAlgoritmaDto.input_sentence
      .split(' ')
      .reduce(
        (longest, current) =>
          current.length > longest.length ? current : longest,
        '',
      );

    return {
      word: longestWord,
      longest: longestWord.length,
    };
  }

  async questionThree(createAlgoritmaDto: CreateAlgoritma3Dto) {
    const result = createAlgoritmaDto.query.map(
      (word) => createAlgoritmaDto.input.filter((item) => item === word).length,
    );

    return {
      result,
    };
  }

  async questionFour(createAlgoritmaDto: CreateAlgoritma4Dto) {
    let diagonal1 = 0;
    let diagonal2 = 0;
    const { matrix } = createAlgoritmaDto;
    const n = matrix.length;

    for (let i = 0; i < n; i++) {
      diagonal1 += matrix[i][i];
      diagonal2 += matrix[i][n - i - 1];
    }

    return Math.abs(diagonal1 - diagonal2);
  }

  findAll() {
    return `This action returns all algoritma`;
  }

  findOne(id: number) {
    return `This action returns a #${id} algoritma`;
  }

  update(id: number, updateAlgoritmaDto: UpdateAlgoritmaDto) {
    return `This action updates a #${id} algoritma`;
  }

  remove(id: number) {
    return `This action removes a #${id} algoritma`;
  }
}
