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
    const expected = '?a=1&b[c]=2&b[d][e]=3&b[d][f]=4&';
    const actual = bracketize_object_querystring(obj);
    expect(actual).toBe(expected);

    const obj2 = {
      page: {
        size: 10,
        number: 1
      }
    };
    const expected2 = 'page[size]=10&page[number]=1&';
    const actual2 = bracketize_object_querystring(obj2, '');
    expect(actual2).toBe(expected2);
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
