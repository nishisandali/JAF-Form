import HelperOptions = Handlebars.HelperOptions;
import { WorkflowField, PdfField, MappedSection } from '@digitaldealers/typings';

import { fitDate } from '../helpers/date.helper';

export const handlebarsHelpers = {
  isArray(value: string | any[], options: HelperOptions): string {
    return (Array.isArray(value))
      ? options.fn(this)
      : options.inverse(this);
  },
  isNotArray(value: string | any[], options: HelperOptions): string {
    return (!Array.isArray(value))
      ? options.fn(this)
      : options.inverse(this);
  },
  isSectionVisible(logicValue: string, section: MappedSection<PdfField>): boolean {
    return (section.condition === 'is' && section.value === logicValue) ||
      (section.condition === 'is Not' && section.value !== logicValue);
  },
  ifCond(v1, v2, options: HelperOptions): string {
    return (v1 === v2)
      ? options.fn(this)
      : options.inverse(this);
  },
  ifNoCond(v1, v2, options: HelperOptions): string {
    return (v1 !== v2)
      ? options.fn(this)
      : options.inverse(this);
  },
  ifAnswerExists(value, options: HelperOptions): string {
    return (!value || !value.length)
      ? options.inverse(this)
      : options.fn(this);
  },
  checkboxActive(value: string, condition: string): string {
    return (value === condition)
      ? 'checked'
      : '';
  },
  processDate(dateString: string, template: string): string {
    return fitDate(new Date(dateString), template);
  },
  increment(value: number): number {
    return value + 1;
  },
  currencyFmt(value: number | string): string {
    if (value === '') {
      return '';
    }
    const num = Number.parseFloat(`${Math.round(Number(value || 0) * 100) / 100}`);
    return Number.isNaN(num) ? '0.00' : num.toFixed(2);
  },
  inc(value: number | string): number {
    return Number.parseInt((value || '0').toString(), 10) + 1;
  },

  getArrayLength(array: any[]): number {
    if (!array) {
      return 0;
    }

    if (!Array.isArray(array)) {
      throw new Error(`Helper error: argument is present, but it is not an array. ${array}`);
    }

    return array.length;
  },
  sliceByControlNames(data: PdfField[], from: string, to: string) {
    const firstIndex = data.findIndex(item => item.controlName === from);
    const lastIndex = data.findIndex(item => item.controlName === to);

    return data.slice(firstIndex, lastIndex + 1);
  },
  sliceByMappingNames(data: PdfField[], from: string, to: string) {
    const firstIndex = data.findIndex(item => item.mappingName === from);
    const lastIndex = data.findIndex(item => item.mappingName === to);

    return data.slice(firstIndex, lastIndex + 1);
  },
  getImageUrl(data: WorkflowField, index: number): string {
    if (!data.sections) {
      throw new Error('"getImageUrl" helper error: object with no sections array passed');
    }

    const imageSection = data.sections.find(section => section.value === data.value);

    if (imageSection &&
      Array.isArray(imageSection.items) &&
      imageSection.items[index] &&
      imageSection.items[index].value &&
      imageSection.items[index].value[0]
    ) {
      return imageSection.items[index].value[0].url || '';
    }

    return '';
  },
  getFieldComment(data: WorkflowField, index: number): string {
    if (!data.sections) {
      throw new Error('"getFieldComment" helper error: object with no sections array passed');
    }

    const commentSection = data.sections.find(section => section.value === data.value);

    if (!commentSection) {
      return '';
    }

    return commentSection.items[index].value;
  },
  getByName(fields: PdfField[], fieldName?: string, property?: string) {
    const field = fields.find(formField => formField.mappingName === fieldName);

    if (!field) {
      throw new Error(`Cannot find field with mapping name ${fieldName}`);
    }

    if (typeof property === 'string') {
      return field[property];
    }

    return field.value;
  },
  getByNameWF(fields: WorkflowField[], fieldName?: string) {
    const field = fields.find(formField => formField.name === fieldName);

    if (!field) {
      throw new Error(`Cannot find field with mapping name ${fieldName}`);
    }

    return field.value;
  },
  getValueByName(fields: PdfField[], fieldName?: string) {
    const field = fields.find(formField => formField.mappingName === fieldName);

    if (!field) {
      throw new Error(`Cannot find field with mapping name ${fieldName}`);
    }

    if (!field.value) {
      return '';
    }

    return field.value.value;
  },
  getValueByNameWF(fields: WorkflowField[], fieldName?: string) {
    const field = fields.find(formField => formField.name === fieldName);

    if (!field) {
      throw new Error(`Cannot find field with mapping name ${fieldName}`);
    }

    if (!field.value) {
      return '';
    }

    return field.value.value;
  },
  getUrlByName(fields: PdfField[], fieldName?: string) {
    const field = fields.find(formField => formField.mappingName === fieldName);

    if (!field) {
      throw new Error(`Cannot get image url for field with mapping name ${fieldName}`);
    }

    if (!field.value) {
      return '';
    }

    if (field.value[0]) {
      return field.value[0].url;
    }

    if (field.value.url) {
      return field.value.url;
    }

    if (field.value.key) {
      return field.value.key;
    }

    return '';
  },
  getCheckboxesData(fields: PdfField[], fieldName: string) {
    const field = fields.find(formField => formField.mappingName === fieldName);

    if (!field) {
      throw new Error(`Cannot find field with mapping name ${fieldName}`);
    }

    if (!field.sections || !field.sections.length) {
      throw new Error('Helper error: cannot get value, sections array is absent or empty');
    }

    const activeSection = field.sections.find(section => section.value === field.value);

    if (!activeSection) {
      return [];
    }

    return activeSection.items[0].value;
  },
  getArrayValueMappingName(fields: PdfField[], fieldName?: string) {
    const field = fields.find(formField => formField.mappingName === fieldName);

    if (!field || !field.children) {
      return '';
    }

    const controlMappingNames: object = {};

    field.children.forEach(child => {
      controlMappingNames[`${child.controlName}`] = child.mappingName;
    });

    return field.value.map(value => {
      const resultObj: object = {};
      Object.keys(value).forEach(key => resultObj[`${controlMappingNames[`${key}`]}`] = value[`${key}`]);
      return resultObj;
    });
  },

  currency(value: number): string {
    return value.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  getPercent(fullValue: number, partValue: number): number {
    return +(partValue * 100 / fullValue).toFixed(2);
  },

  yesChosen(value) {
    return (value === 'Yes' || value === 'Standard' || value === 'A')
      ? 'checked'
      : '';
  },

  noChosen(value) {
    return (value === 'No' || value === 'Oversized' || value === 'B')
      ? 'checked'
      : '';
  },

  yaChosen(value) {
    return (value === 'Ya')
      ? 'checked'
      : '';
  },

  tidakChosen(value) {
    return (value === 'Tidak')
      ? 'checked'
      : '';
  },

  getQuestionByName(fields: PdfField[], fieldName?: string) {
    const field = fields.find(formField => formField.mappingName === fieldName);

    if (!field) {
      throw new Error(`Cannot find field with mapping name ${fieldName}`);
    }

    if (!field.question) {
      return '';
    }

    return field.question;
  },

  setVariableInc(varName, varValue, options) {
    if (!options.data.root) {
      options.data.root = {};
    }

    if (options.data.root[varName]) {
      options.data.root[varName] += 1;
    } else {
      options.data.root[varName] = varValue;
    }
  },

  ifFieldExist(fields: PdfField[], fieldName: string, options: HelperOptions) {
    const field = fields.find(formField => formField.mappingName === fieldName);

    return (field)
      ? options.fn(this)
      : options.inverse(this);
  },

  getValueFromObj(this: any, object: object) {
    return object[this.mappingName];
  }
};
