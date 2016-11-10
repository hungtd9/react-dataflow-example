import {ActionTest} from 'redux-testkit';
import MockRedditService from '../../services/mockReddit';
import * as postReducer from '../../../src/store/posts/reducer';
import * as topicsActionTypes from '../../../src/store/topics/actionTypes';
import * as topicsReducer from '../../../src/store/topics/reducer';

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

});