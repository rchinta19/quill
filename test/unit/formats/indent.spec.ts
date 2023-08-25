import Delta from 'quill-delta';
import {
  createScroll as baseCreateScroll,
  createRegistry,
} from '../__helpers__/factory';
import Editor from '../../../core/editor';
import List, { ListContainer } from '../../../formats/list';
import IndentClass from '../../../formats/indent';
import { describe, expect, test } from 'vitest';

const createScroll = (html: string) =>
  baseCreateScroll(html, createRegistry([ListContainer, List, IndentClass]));

describe('Indent', () => {
  test('+1', () => {
    const editor = new Editor(
      createScroll('<ol><li data-list="bullet">0123</li></ol>'),
    );
    editor.formatText(4, 1, { indent: '+1' });
    expect(editor.getDelta()).toEqual(
      new Delta().insert('0123').insert('\n', { list: 'bullet', indent: 1 }),
    );
    expect(editor.scroll.domNode).toEqualHTML(`
      <ol>
        <li class="ql-indent-1" data-list="bullet">0123</li>
      </ol>
    `);
  });

  test('-1', () => {
    const editor = new Editor(
      createScroll(
        '<ol><li data-list="bullet" class="ql-indent-1">0123</li></ol>',
      ),
    );
    editor.formatText(4, 1, { indent: '-1' });
    expect(editor.getDelta()).toEqual(
      new Delta().insert('0123').insert('\n', { list: 'bullet' }),
    );
    expect(editor.scroll.domNode).toEqualHTML(`
      <ol>
        <li data-list="bullet">0123</li>
      </ol>
    `);
  });
});