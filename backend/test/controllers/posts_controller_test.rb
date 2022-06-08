require "test_helper"

class PostsControllerTest < ActionDispatch::IntegrationTest
  def make_create_post_request(opts)
    SecureRandom.stub :hex, 'posturl' do
      SecureRandom.stub :uuid, '285b9102-fb53-4f9b-9c6a-46198c689825' do
        image = opts[:image].nil? ? nil : fixture_file_upload(opts[:image], 'image/jpeg')
        post api_posts_path, params: {
          image: image,
          password: opts[:password],
          'blur-level': opts[:blur_level],
          description: opts[:description]
        }
      end
    end
  end

  def assert_create_post_valid(opts)
    assert_request body: {
      success: true,
      url: 'posturl'
    }
    db_post = Post.find_by(post_url: 'posturl')
    test_post = {
      # Ignore
      id: db_post[:id],
      post_url: 'posturl',
      file_uuid: '285b9102-fb53-4f9b-9c6a-46198c689825',
      description: opts[:description] || '',
      user_id: get_regular_user.id,
      # Ignore
      created_at: db_post[:created_at],
      password: '123',
      reviewed: false,
      sponsored: false
    }
    assert_equal test_post.to_json, db_post.to_json
    bin_expected = File.binread('test/fixtures/files/post.jpg')
    bin_actual = File.binread('public/images/285b9102-fb53-4f9b-9c6a-46198c689825123.jpg')
    assert_equal bin_expected, bin_actual
    blur_expected = File.binread("test/fixtures/files/post-blur-#{opts[:blur_level] * 5}.jpg")
    blur_actual = File.binread('public/images/285b9102-fb53-4f9b-9c6a-46198c689825.jpg')
    assert_equal blur_expected, blur_actual
  end

  def cleanup_create_post
    File.delete('public/images/285b9102-fb53-4f9b-9c6a-46198c689825.jpg')
    File.delete('public/images/285b9102-fb53-4f9b-9c6a-46198c689825123.jpg')
  end

  def assert_create_post_invalid
    assert !File.file?('public/images/285b9102-fb53-4f9b-9c6a-46198c689825.jpg')
    assert !File.file?('public/images/285b9102-fb53-4f9b-9c6a-46198c689825123.jpg')
  end

  test "successful post with blur level 20" do
    login_regular_user
    make_create_post_request image: 'post.jpg', password: '123', blur_level: 20
    assert_create_post_valid blur_level: 20
    cleanup_create_post
  end

  test "successful post with blur level 5" do
    login_regular_user
    make_create_post_request image: 'post.jpg', password: '123', blur_level: 5
    assert_create_post_valid blur_level: 5
    cleanup_create_post
  end

  test "successful post with description" do
    login_regular_user
    make_create_post_request image: 'post.jpg', password: '123', blur_level: 5, description: 'test'
    assert_create_post_valid blur_level: 5, description: 'test'
    cleanup_create_post
  end

  test "failed create post logged out" do
    make_create_post_request image: 'post.jpg', password: '123', blur_level: 20
    assert_require_login
    assert_create_post_invalid
  end

  test "failed create post missing params" do
    login_regular_user
    make_create_post_request password: '123', blur_level: 5
    assert_missing_param
    make_create_post_request image: 'post.jpg', blur_level: 5
    assert_missing_param
    make_create_post_request image: 'post.jpg', password: '123'
    assert_missing_param
    assert_create_post_invalid
  end

  test "failed to delete post not logged in" do
    delete "/api/posts/#{get_post_to_delete.id}"
    assert_require_login
  end

  test "failed to delete post no permission" do
    login_admin_user
    delete "/api/posts/#{get_post_to_delete.id}"
    assert_no_permission
  end

  test "successfully delete post" do
    login_user
    delete "/api/posts/#{get_post_to_delete.id}"
    assert_request body: {
      success: true
    }
    assert !Post.exists?(id: get_post_to_delete.id)
  end
end
