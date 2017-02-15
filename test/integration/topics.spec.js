import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {WaitForAsyncsMiddleware} from 'redux-testkit';
import _ from 'lodash';
import * as mocker from '../mocker';
import MockRedditService from '../services/mockReddit';

import * as reducers from '../../src/store/reducers';
import * as topicsSelectors from '../../src/store/topics/reducer';
import * as postsSelector from '../../src/store/posts/reducer';

describe('topics integration', () => {
  const topics = mocker.mockTopics();
  let redditService = new MockRedditService();
  let uut;
  let store;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    redditService.reset();
    jest.setMock('../../src/services/reddit', redditService);
    uut = require('../../src/store/topics/actions');

    store = createStore(combineReducers(reducers), applyMiddleware(WaitForAsyncsMiddleware.createMiddleware(), thunk));
    WaitForAsyncsMiddleware.reset();
  });

  beforeEach(async () => {
    redditService.getDefaultSubreddits.mockReturnValue(Promise.resolve(topics));
    await store.dispatch(uut.fetchTopics());
  });

  it('should fetchTopics and set them in store', async () => {
    // fetch was made in beforeEach

    expect(redditService.getDefaultSubreddits).toHaveBeenCalled();
    const topicsByUrl = topicsSelectors.getTopics(store.getState())[0];
    expect(_.values(topicsByUrl)).toEqual(topics);
  });

  it('should selectTopic - select 1 topic', async () => {
    expect(topicsSelectors.getSelectedTopicUrls(store.getState())).toEqual([]);
    await store.dispatch(uut.selectTopic(topics[2].url));
    expect(topicsSelectors.getSelectedTopicUrls(store.getState())).toEqual([topics[2].url]);
  });

  it('should selectTopic - select 3 topics', async () => {
    const posts = mocker.mockPosts();
    redditService.getPostsFromSubreddit.mockReturnValue(Promise.resolve(posts));
    store.dispatch(uut.selectTopic(topics[2].url));
    store.dispatch(uut.selectTopic(topics[0].url));
    store.dispatch(uut.selectTopic(topics[4].url));
    expect(topicsSelectors.getSelectedTopicUrls(store.getState())).toEqual([topics[2].url, topics[0].url, topics[4].url]);
    await WaitForAsyncsMiddleware.waitForPendingAsyncs();
    const postsById = postsSelector.getPosts(store.getState())[0];
    expect(_.values(postsById).length).toBe(posts.length);
  });

});