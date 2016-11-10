import {ActionTest} from 'redux-testkit';
import proxyquire from 'proxyquire'
import MockRedditService from '../../services/mockReddit';
import * as postReducer from '../../../src/store/posts/reducer';
import * as postActionTypes from '../../../src/store/posts/actionTypes';
import * as topicsReducer from '../../../src/store/topics/reducer';

describe('post actions test', () => {

  let actionTest = new ActionTest();
  let mockService = new MockRedditService();
  let uut;

  const URL_1 = 'url1';
  const URL_2 = 'url2';
  const topic1 = {
    "id": "topicId1",
    "title": "Topic!",
    "topicUrl": URL_1,
    "body":"",
    "thumbnail": "thumbnail.jpg",
    "url": "img.jpg"
  };
  const topic2 = {
    "id": "topicId2",
    "title": "Topic!",
    "topicUrl": URL_2,
    "body":"",
    "thumbnail": "thumbnail.jpg",
    "url": "img.jpg"
  };

  const originalConsoleError = console.error;
  const mockedConsoleError = jest.fn();

  beforeEach(() => {
    mockService.reset() ;
    actionTest.reset();
    jest.setMock('../../../src/services/reddit', mockService);
    uut = require('../../../src/store/posts/actions');
    console.error = mockedConsoleError;
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });


  it('should fetch posts from the reddit service from one selected topic', () => {
    mockService.addPostsfromSubbredditReturn([topic1]);
    mockService.addPostsfromSubbredditReturn([topic2]);
    actionTest.setState({
      topics: {
        selectedTopicUrls: [URL_1]
      }
    });
    actionTest.dispatchSync(uut.fetchPosts());
    expect(mockService.getPostsFromSubreddit).toHaveBeenCalledTimes(1);
    expect(mockService.getPostsFromSubreddit).toHaveBeenCalledWith(URL_1);
    expect(actionTest.getDispatched(0).isPlainObject()).toBe(true);
    expect(actionTest.getDispatched(0).getType()).toBe(postActionTypes.POSTS_FETCHED);
    expect(actionTest.getDispatched(0).getParams().postsById).toEqual({topicId1: topic1});
  });


  it('should fetch posts from the reddit service from multiple selected topics and normalize them', () => {
    mockService.addPostsfromSubbredditReturn([topic2]);
    mockService.addPostsfromSubbredditReturn([topic1]);
    actionTest.setState({
      topics: {
        selectedTopicUrls: [URL_1, URL_2]
      }
    });
    actionTest.dispatchSync(uut.fetchPosts());
    expect(mockService.getPostsFromSubreddit).toHaveBeenCalledTimes(2);
    expect(mockService.getPostsFromSubreddit).toHaveBeenCalledWith(URL_1);
    expect(mockService.getPostsFromSubreddit).toHaveBeenCalledWith(URL_2);
    expect(actionTest.getDispatched(0).isPlainObject()).toBe(true);
    expect(actionTest.getDispatched().length).toBe(1);
    expect(actionTest.getDispatched(0).getType()).toBe(postActionTypes.POSTS_FETCHED);
    expect(actionTest.getDispatched(0).getParams().postsById).toEqual({topicId1: topic1, topicId2: topic2});
  });

  it('should log an error if there was an error in the service', () => {
    mockService.getPostsFromSubreddit.mockImplementationOnce(() => {throw "error!"});
    actionTest.setState({
      topics: {
        selectedTopicUrls: [URL_1]
      }
    });
    actionTest.dispatchSync(uut.fetchPosts());
    expect(mockService.getPostsFromSubreddit).toHaveBeenCalledTimes(1);
    expect(mockService.getPostsFromSubreddit).toHaveBeenCalledWith(URL_1);
    expect(actionTest.getDispatched(0)).toBeUndefined();
    expect(mockedConsoleError).toHaveBeenCalledTimes(1);
    expect(mockedConsoleError).toHaveBeenCalledWith("error!");
  });

});