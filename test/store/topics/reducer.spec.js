import {ReducerTest} from 'redux-testkit';
import * as actionTypes from '../../../src/store/topics/actionTypes';
import * as reducer from '../../../src/store/topics/reducer';
import Immutable from 'seamless-immutable';

describe('topics reducer', () => {

  const reducerTest = new ReducerTest(reducer.default, reducer.initialState).throwOnMutation();

  const params  = [
    {
      action: {type: actionTypes.TOPICS_SELECTED , selectedTopicUrls: ['aaa']},
      expected: {...reducer.initialState, selectedTopicUrls: ['aaa']},
      description: 'adds a selected topic'
    },
    {
      state: Immutable({...reducer.initialState, selectedTopicUrls: ['aaa']}),
      action: {type: actionTypes.TOPICS_SELECTED , selectedTopicUrls: ['bbb']},
      expected: {...reducer.initialState, selectedTopicUrls: ['bbb']},
      description: 'replaces selected topics'
    },
    {
      action: {type: actionTypes.TOPICS_FETCHED, topicsByUrl: 'TOPICS'},
      expected: {...reducer.initialState, topicsByUrl: 'TOPICS'},
      description: 'fetches topics'
    },
    {
      action: {type: actionTypes.TOPIC_SELECTION_FINALIZED},
      expected: {...reducer.initialState, selectionFinalized: true},
      description: 'fetches topics'
    }
  ];

  reducerTest.test('test topics reducer', params,
      (result, expected) => expect(result).toEqual(expected)
  );
});