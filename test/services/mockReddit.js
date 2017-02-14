export default class MockRedditService {

  getDefaultSubreddits;
  getPostsFromSubreddit;

  reset() {
    this.getDefaultSubreddits = jest.fn();
    this.getPostsFromSubreddit = jest.fn();
  }

  addDefaultSubbredditReturn(value) {
    this.getDefaultSubreddits.mockReturnValueOnce(value);
  }

  addPostsfromSubbredditReturn(value) {
    this.getPostsFromSubreddit.mockReturnValueOnce(value);
  }

  throwOnGetDefaultSubreddits(error) {
    this.getDefaultSubreddits = jest.fn(() => {throw new Error(error)});
  }
}