# Users
aleksa = User.create!(username: 'aleksa', real_name: 'Aleksa Marković', password: 'sifra', is_admin: true)
luka = User.create!(username: 'luka', real_name: 'Luka Simić', password: 'sifra', is_admin: true)
ivan = User.create!(username: 'ivan', real_name: 'Ivan Pešić', password: 'sifra', is_admin: false)
miljan = User.create!(username: 'miljan', real_name: 'Miljan Marković', password: 'sifra', is_admin: false)
tasha = User.create!(username: 'tasha', real_name: 'Tamara Šekularac', password: 'sifra', is_admin: false)
pavled = User.create!(username: 'pavled', real_name: 'Pavle Divović', password: 'sifra', is_admin: false)
drazendr = User.create!(username: 'drazendr', real_name: 'Dražen Drašković', password: 'sifra', is_admin: false)
bojicd = User.create!(username: 'bojicd', real_name: 'Dragan Bojić', password: 'sifra', is_admin: false)
postalot = User.create!(username: 'postalot', real_name: 'Infinite scroll test', password: 'sifra', is_admin: false)

# Followers
Follow.create!(followee_id: aleksa.id, follower_id: luka.id)
Follow.create!(followee_id: aleksa.id, follower_id: ivan.id)
Follow.create!(followee_id: aleksa.id, follower_id: miljan.id)
Follow.create!(followee_id: aleksa.id, follower_id: tasha.id)
Follow.create!(followee_id: aleksa.id, follower_id: drazendr.id)
Follow.create!(followee_id: aleksa.id, follower_id: pavled.id)
Follow.create!(followee_id: luka.id, follower_id: tasha.id)
Follow.create!(followee_id: luka.id, follower_id: aleksa.id)
Follow.create!(followee_id: luka.id, follower_id: ivan.id)
Follow.create!(followee_id: luka.id, follower_id: bojicd.id)
Follow.create!(followee_id: luka.id, follower_id: drazendr.id)
Follow.create!(followee_id: tasha.id, follower_id: luka.id)
Follow.create!(followee_id: tasha.id, follower_id: drazendr.id)
Follow.create!(followee_id: tasha.id, follower_id: bojicd.id)
Follow.create!(followee_id: tasha.id, follower_id: pavled.id)
Follow.create!(followee_id: ivan.id, follower_id: luka.id)
Follow.create!(followee_id: ivan.id, follower_id: miljan.id)
Follow.create!(followee_id: ivan.id, follower_id: aleksa.id)
Follow.create!(followee_id: pavled.id, follower_id: tasha.id)
Follow.create!(followee_id: pavled.id, follower_id: luka.id)
Follow.create!(followee_id: bojicd.id, follower_id: luka.id)
Follow.create!(followee_id: drazendr.id, follower_id: luka.id)

# Posts
def post_helper(url, blur_level, password)
  uuid = SecureRandom.uuid
  imageLocked = MiniMagick::Image.open(url)
  imageLocked.write "public/images/#{uuid}_#{password}.jpg"
  imageLocked.combine_options do |i|
    i.blur "0x#{blur_level * 5}"
  end
  imageLocked.write "public/images/#{uuid}.jpg"
  return uuid
end

hedgehog = Post.new
hedgehog.file_uuid = post_helper(
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Domesticated_Baby_Hedgehog.jpg/640px-Domesticated_Baby_Hedgehog.jpg',
  10, 'hedgehog')
hedgehog.post_url = 'jezjezjez'
hedgehog.user_id = tasha.id
hedgehog.password = 'hedgehog'
hedgehog.description = 'Guess my favorite animal!'
hedgehog.reviewed = false
hedgehog.save!

etf = Post.new
etf.file_uuid = post_helper(
  'https://www.etf.bg.ac.rs/uploads/attachment/slajd/4/large_%D0%95%D0%A2%D0%A4-%D0%97%D0%B3%D1%80%D0%B0%D0%B4%D0%B0-5.jpg',
  30, 'mojfaks')
etf.post_url = 'eeeetf'
etf.user_id = drazendr.id
etf.password = 'mojfaks'
etf.reviewed = true
etf.save!

# Creating a lot of posts on one account
cloned_photo_uuid = post_helper('https://picsum.photos/512/512', 20, 'postalot')
38.times do |i|
  cloned_post = Post.new
  cloned_post.file_uuid = cloned_photo_uuid
  cloned_post.post_url = "cloned#{i}"
  cloned_post.description = "I love #blurr"
  cloned_post.password = '123'
  cloned_post.user_id = postalot.id
  cloned_post.reviewed = false
  cloned_post.save!

  # A lot of comments
  10.times do |i|
    x = Comment.create!(post_id: cloned_post.id, user_id: postalot.id, comment_text: "#{i}. comment")
  end

  # Hashtag
  Hashtag.create!(post_id: cloned_post.id, tag_name: 'blurr');
end

# Post likes
PostLike.create!(user_id: drazendr.id, post_id: hedgehog.id)
PostLike.create!(user_id: aleksa.id, post_id: hedgehog.id)
PostLike.create!(user_id: luka.id, post_id: hedgehog.id)
PostLike.create!(user_id: ivan.id, post_id: hedgehog.id)
PostLike.create!(user_id: pavled.id, post_id: hedgehog.id)

# Unlocks
Unlock.create!(user_id: luka.id, post_id: hedgehog.id)
Unlock.create!(user_id: ivan.id, post_id: hedgehog.id)
Unlock.create!(user_id: drazendr.id, post_id: hedgehog.id)

# Comments
adorable_comment = Comment.create!(post_id: hedgehog.id, user_id: ivan.id, comment_text: 'Adorable!')
ikr_comment = Comment.create!(post_id: hedgehog.id, user_id: tasha.id, parent_comment_id: adorable_comment.id, comment_text: 'I know, right')
ohmy_comment = Comment.create!(post_id: hedgehog.id, user_id: miljan.id, parent_comment_id: adorable_comment.id, comment_text: 'Oh my')

# Comment likes
CommentLike.create!(user_id: tasha.id, comment_id: adorable_comment.id)
CommentLike.create!(user_id: ivan.id, comment_id: ikr_comment.id)
CommentLike.create!(user_id: miljan.id, comment_id: ikr_comment.id)
CommentLike.create!(user_id: aleksa.id, comment_id: ikr_comment.id)
CommentLike.create!(user_id: luka.id, comment_id: ikr_comment.id)
CommentLike.create!(user_id: ivan.id, comment_id: ohmy_comment.id)

# Blocks
Block.create!(blockee_id: postalot.id, blocker_id: tasha.id)
