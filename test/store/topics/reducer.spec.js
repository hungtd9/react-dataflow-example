import {ReducerTest} from 'redux-testkit';
import * as actionTypes from '../../../src/store/topics/actionTypes';
import * as reducer from '../../../src/store/topics/reducer';
import Immutable from 'seamless-immutable';

describe('topics reducer', () => {

  const reducerTest = new ReducerTest(reducer.default, reducer.initialState).throwOnMutation();

  const params  = [
    {
      action: {type: 'nonexisting_type', someAction: '12345'},
      expected: {...reducer.initialState},
      description: 'initial state'
    },
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
    },
  ];

  reducerTest.test('test topics reducer', params,
      (result, expected) => expect(result).toEqual(expected)
  );

  it('should return initial state for undefined values', () => {
    expect(reducer.default(undefined, undefined)).toEqual({...reducer.initialState});
  });
});

describe('selectors', () => {
  const state = Immutable({
    topics: {
      selectedTopicUrls: [],
      topicsByUrl: {
        'a/b/c': {
          url: 'a/b/c',
          title: 'a',
          description: 'b'
        },
        'e/f/g': {
          url: 'e/f/g',
          title: 'e',
          description: 'f'
        }
      },
      selectedTopicUrls: ['a/b/c'],
      selectionFinalized: false
    }
  });

  it('should get topics', () => {
    const [topicsByUrl, topicsUrlArray] = reducer.getTopics(state);
    expect(topicsByUrl).toBe(state.topics.topicsByUrl);
    expect(topicsUrlArray).toEqual(['a/b/c', 'e/f/g']);
  });

  it('should get selected topics URLs', () => {
    expect(reducer.getSelectedTopicUrls(state)).toBe(state.topics.selectedTopicUrls);
  });

  it('should get selected topics by URL', () => {
    const selectedTopicUrl = state.topics.selectedTopicUrls[0];
    const selectedTopic = state.topics.topicsByUrl[selectedTopicUrl];
    const expected = {};
    expected[selectedTopicUrl] = selectedTopic;
    expect(reducer.getSelectedTopicsByUrl(state)).toEqual(expected);
  });

  it('should validate topic selection', () => {
    expect(reducer.isTopicSelectionValid(state)).toBe(false);
    expect(reducer.isTopicSelectionValid({topics: {selectedTopicUrls: ['1', '2', '3']}})).toBe(true);
  });

  it('should cjeck if topic is finalized', () => {
    expect(reducer.isTopicSelectionFinalized(state)).toBe(false);
    expect(reducer.isTopicSelectionFinalized({topics: {selectionFinalized: true}})).toBe(true);
  });
});