import { Injectable } from '@angular/core';
import * as diff from 'diff';

@Injectable({
  providedIn: 'root'
})
export class CodeDiffService {

  constructor() { }

  compareCodeVersions(oldCode: string, newCode: string) {
    const diffResult = diff.diffLines(oldCode, newCode);
    let oldLineNum = 0;
    let newLineNum = 0;

    return diffResult.map(part => {
        const lines = part.value.split('\n');
        // Se a última linha for vazia, remova-a
        if (lines[lines.length - 1] === '') {
            lines.pop();
        }
        const result = {
            type: part.added ? 'added' : part.removed ? 'removed' : 'unchanged',
            lines: lines.map((line, index) => ({
                lineNum: part.added ? newLineNum + index + 1 : part.removed ? oldLineNum + index + 1 : oldLineNum + index + 1,
                value: line
            }))
        };

        if (!part.added) {
            oldLineNum += lines.length;
        }

        if (!part.removed) {
            newLineNum += lines.length;
        }

        return result;
    });
}

}

