import {ReducerTest} from 'redux-testkit';
import * as postActionTypes from '../../../src/store/posts/actionTypes';
import * as reducer from '../../../src/store/posts/reducer';

const URL_A = 'urlA';
const URL_B = 'urlB';
const URL_C = 'urlC';
const topicA = {
  "id": "topicIdA",
  "topicUrl": URL_A
};
const topicB = {
  "id": "topicIdB",
  "topicUrl": URL_B
};
const topicC = {
  "id": "topicIdC",
  "topicUrl": URL_C
};
const postsById = {
  topicIdA: topicA,
  topicIdB: topicB,
  topicIdC: topicC
};

describe('test the reduce function', () => {
  const reducerTest = new ReducerTest(reducer.default, reducer.initialState).throwOnMutation();
  const params = [
    {
      action: {type: 'nonexisting_type', someAction: '12345'},
      expected: {...reducer.initialState},
      description: 'initial state'
    },
    {
      action: {type: postActionTypes.POSTS_FETCHED, postsById},
      expected: {...reducer.initialState, postsById},
      description: 'posts are fetched'
    },
    {
      action: {type: postActionTypes.FILTER_CHANGED, filter: 'some_filter'},
      expected: {...reducer.initialState, currentFilter: 'some_filter'},
      description: 'filter changed'
    },
    {
      action: {type: postActionTypes.POST_SELECTED, postId: topicA.id},
      expected: {...reducer.initialState, currentPostId: topicA.id},
      description: 'post selected'
    },
  ];

  reducerTest.test('test topics reducer', params,
    (result, expected) => expect(result).toEqual(expected)
  );

  it('should return initial state for undefined values', () => {
    expect(reducer.default(undefined, undefined)).toEqual({...reducer.initialState});
  });
});
