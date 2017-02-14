import {ActionTest} from 'redux-testkit';
import MockRedditService from '../../services/mockReddit';
import * as topicsActionTypes from '../../../src/store/topics/actionTypes';

describe('Topics actions', () => {

  let actionTest = new ActionTest();
  let mockService = new MockRedditService();
  let uut;
  let selectedTopicUrls;

  const URL1 = 'url1';
  const URL2 = 'url2';
  const URL3 = 'url3';
  const URL4 = 'url4';

  beforeEach(() => {
    mockService.reset() ;
    actionTest.reset();
    selectedTopicUrls = [];
    jest.setMock('../../../src/services/reddit', mockService);
    jest.setMock('../../../src/store/topics/reducer', {
      getSelectedTopicUrls: () => selectedTopicUrls
    });
    uut = require('../../../src/store/topics/actions');
  });


  it('should select a topic', () => {
    actionTest.dispatchSync(uut.selectTopic(URL1));
    expect(actionTest.getDispatched(0).isPlainObject()).toBe(true);
    expect(actionTest.getDispatched(0).getType()).toBe(topicsActionTypes.TOPICS_SELECTED);
    expect(actionTest.getDispatched(0).getParams().selectedTopicUrls).toEqual([URL1]);
    expect(actionTest.getDispatched(1)).toBeUndefined();
  });

  it('should dispatch a fetch when third url is selected', () => {
    selectedTopicUrls = [URL1, URL2];
    actionTest.dispatchSync(uut.selectTopic(URL3));
    expect(actionTest.getDispatched(0).isFunction()).toBe(true);
    expect(actionTest.getDispatched(0).getName()).toBe('fetchPosts');

    expect(actionTest.getDispatched(1).isPlainObject()).toBe(true);
    expect(actionTest.getDispatched(1).getType()).toBe(topicsActionTypes.TOPICS_SELECTED);
    expect(actionTest.getDispatched(1).getParams().selectedTopicUrls).toEqual([URL1, URL2, URL3]);
    expect(actionTest.getDispatched(2)).toBeUndefined();
  });


  it('should only select three topics', () => {
    selectedTopicUrls = [URL1, URL2, URL3];
    actionTest.dispatchSync(uut.selectTopic(URL4));
    expect(actionTest.getDispatched(1).isPlainObject()).toBe(true);
    expect(actionTest.getDispatched(1).getType()).toBe(topicsActionTypes.TOPICS_SELECTED);
    expect(actionTest.getDispatched(1).getParams().selectedTopicUrls).toEqual([URL2, URL3, URL4]);
    expect(actionTest.getDispatched(2)).toBeUndefined();
  });

  it('should unselect topic url if same url is selected', () => {
    selectedTopicUrls = [URL1, URL2];
    actionTest.dispatchSync(uut.selectTopic(URL1));
    expect(actionTest.getDispatched(0).getType()).toBe(topicsActionTypes.TOPICS_SELECTED);
    expect(actionTest.getDispatched(0).getParams().selectedTopicUrls).toEqual([URL2]);
    expect(actionTest.getDispatched(1)).toBeUndefined();
  });

  it('should fetch topics', () => {
    const defaultSubbreddit = [{description: 'a', title: '1', url: URL1}, {description: 'b', title: '2', url: URL2}];
    const expectedTopicsByUrl = {};
    expectedTopicsByUrl[URL1] = defaultSubbreddit[0];
    expectedTopicsByUrl[URL2] = defaultSubbreddit[1];
    mockService.addDefaultSubbredditReturn(defaultSubbreddit);
    actionTest.dispatchSync(uut.fetchTopics());
    expect(actionTest.getDispatched(0).getType()).toBe(topicsActionTypes.TOPICS_FETCHED);
    expect(actionTest.getDispatched(0).getParams().topicsByUrl).toEqual(expectedTopicsByUrl);
  });

  it('should console error when fetch topics throws', () => {
    mockService.throwOnGetDefaultSubreddits('testing error');
    console.error = jest.fn();
    actionTest.dispatchSync(uut.fetchTopics());
    expect(actionTest.getDispatched(0)).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(Error('testing error'));
  });

  it('should finalize topics selection', () => {
    const selectPostAction = actionTest.dispatchSync(uut.finalizeTopicSelection());
    expect(selectPostAction.type).toBe(topicsActionTypes.TOPIC_SELECTION_FINALIZED);
  });
});