class ReviewController < ApplicationController
  skip_before_action :verify_authenticity_token, :only => [:get, :submit]
  def get
    # TODO: Prototype data
    render json: {
      success: true,
      posts: [
        {
          id: '5d60ac94-39d1-4b46-a93d-8fe26cea736b',
          photoURL: 'https://picsum.photos/600?t=1',
          description: 'Hello World',
          haveLiked: false,
          time: '2022-03-24T10:14:07.911Z',
          poster: {
            id: 1,
            username: 'john',
            realName: 'john doe',
            profileURL: 'https://picsum.photos/400?t=1',
            profilePhotoURL: 'https://picsum.photos/400?t=1',
            amFollowing: true,
            numberOfPosts: 0,
            numberOfFollowers: 0,
            numberFollowing: 0
          },
          comments: []
        },
        {
          id: 'fdb98d82-bf16-4592-98b1-3c27daa2565a',
          photoURL: 'https://picsum.photos/600?t=2',
          description: 'This is a bad post.',
          haveLiked: false,
          time: '2022-03-24T10:14:07.911Z',
          poster: {
            id: 2,
            username: 'sara',
            realName: 'sara mack',
            profileURL: 'https://picsum.photos/400?t=2',
            profilePhotoURL: 'https://picsum.photos/400?t=2',
            amFollowing: true,
            numberOfPosts: 0,
            numberOfFollowers: 0,
            numberFollowing: 0
          },
          comments: []
        }
      ]
    }
  end
  def submit
    # TODO: Prototype data
    render json: {success: true}
  end
end
