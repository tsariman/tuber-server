import {
  bracketize_object_querystring,
  clone_with_descriptors
} from '../../business.logic';

describe('Testing file: src/business.logic/index.ts', () => {

  test('[function] bracketize_object_querystring()', () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
          f: 4
        }
      }
    };
    const expected = '?a=1&b[c]=2&b[d][e]=3&b[d][f]=4';
    const actual = bracketize_object_querystring(obj);
    expect(actual).toBe(expected);

    const obj2 = {
      page: {
        size: 10,
        number: 1
      }
    };
    const expected2 = 'page[size]=10&page[number]=1';
    const actual2 = bracketize_object_querystring(obj2, '');
    expect(actual2).toBe(expected2);

    // Test null/undefined handling
    const obj3 = {
      a: 1,
      b: null,
      c: undefined,
      d: 'test'
    };
    const expected3 = '?a=1&d=test';
    const actual3 = bracketize_object_querystring(obj3);
    expect(actual3).toBe(expected3);

    // Test array handling
    const obj4 = {
      tags: ['red', 'blue', 'green']
    };
    const expected4 = '?tags[0]=red&tags[1]=blue&tags[2]=green';
    const actual4 = bracketize_object_querystring(obj4);
    expect(actual4).toBe(expected4);

    // Test empty object
    const obj5 = {};
    const expected5 = '';
    const actual5 = bracketize_object_querystring(obj5);
    expect(actual5).toBe(expected5);

    // Test URL encoding (keys with spaces should be encoded, but brackets preserved)
    const obj6 = {
      'special key': 'value with spaces & symbols',
      nested: {
        'another key': 'test'
      }
    };
    const expected6 = '?special%20key=value%20with%20spaces%20%26%20symbols&nested[another%20key]=test';
    const actual6 = bracketize_object_querystring(obj6);
    expect(actual6).toBe(expected6);
  });

  test('[function] clone_with_descriptors()', () => {
    const r = (key: string, txt: string) => `${key}:${txt}`;
    const obj1 = {
      '_type': 'alert',
      '_id': '35',
      '_key': 'clientAlertDialog',
      get 'title'() { return r('43', 'Feedback'); },
      'props': { 'fullWidth': true },
      'titleProps': {
        'sx': { 'textAlign': 'center' }
      },
      'content': '',
      'actions': [
        {
          'type': 'state_button',
          'props': { 'color': 'secondary' },
          'has': {
            get 'text'() { return r('44', 'Cancel'); },
            'onclickHandle': 'tuberCallbacks.defaultClose'
          }
        }
      ]
    };

    const copy = clone_with_descriptors(obj1);
    expect(
      typeof Object.getOwnPropertyDescriptor(copy.actions[0].has, 'text')!.get
    ).toBe('function');
  });
});
