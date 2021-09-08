import Quill from 'quill';
import { TemplateVariableModel } from '../../models';

const Embed = Quill.import('blots/embed');

export class TemplateVariable extends Embed {
  static create(value: TemplateVariableModel): HTMLElement {
    const node: HTMLElement = super.create(value);
    node.setAttribute(
      'class',
      'inline-flex items-center justify-center p-1 text-xs leading-none text-black bg-blue-100 rounded-full'
    );
    node.setAttribute('data-name', value.name);
    node.setAttribute('data-marker', value.marker);
    node.innerHTML = value.name;
    return node;
  }

  static value(node: HTMLElement): TemplateVariableModel {
    return {
      name: node.getAttribute('data-name') || '',
      marker: node.getAttribute('data-marker') || '',
    };
  }
}
