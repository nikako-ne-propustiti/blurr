# Users
aleksa = User.create(username: 'aleksa', real_name: 'Aleksa Marković', password: 'sifra', is_admin: true)
luka = User.create(username: 'luka', real_name: 'Luka Simić', password: 'sifra', is_admin: true)
ivan = User.create(username: 'ivan', real_name: 'Ivan Pešić', password: 'sifra', is_admin: false)
miljan = User.create(username: 'miljan', real_name: 'Miljan Marković', password: 'sifra', is_admin: false)
tasha = User.create(username: 'tasha', real_name: 'Tamara Šekularac', password: 'sifra', is_admin: false)
pavled = User.create(username: 'pavled', real_name: 'Pavle Divović', password: 'sifra', is_admin: false)
drazendr = User.create(username: 'drazendr', real_name: 'Dražen Drašković', password: 'sifra', is_admin: false)
bojicd = User.create(username: 'bojicd', real_name: 'Dragan Bojić', password: 'sifra', is_admin: false)

# Followers
Follow.create(follower_id: aleksa.id, followee_id: luka.id)
Follow.create(follower_id: aleksa.id, followee_id: ivan.id)
Follow.create(follower_id: aleksa.id, followee_id: miljan.id)
Follow.create(follower_id: aleksa.id, followee_id: tasha.id)
Follow.create(follower_id: aleksa.id, followee_id: pavled.id)
Follow.create(follower_id: luka.id, followee_id: tasha.id)
Follow.create(follower_id: luka.id, followee_id: aleksa.id)
Follow.create(follower_id: luka.id, followee_id: ivan.id)
Follow.create(follower_id: luka.id, followee_id: bojicd.id)
Follow.create(follower_id: luka.id, followee_id: drazendr.id)
Follow.create(follower_id: ivan.id, followee_id: luka.id)
Follow.create(follower_id: ivan.id, followee_id: miljan.id)
Follow.create(follower_id: ivan.id, followee_id: aleksa.id)
Follow.create(follower_id: tasha.id, followee_id: luka.id)
Follow.create(follower_id: tasha.id, followee_id: drazendr.id)
Follow.create(follower_id: tasha.id, followee_id: bojicd.id)
Follow.create(follower_id: tasha.id, followee_id: pavled.id)
Follow.create(follower_id: pavled.id, followee_id: tasha.id)
Follow.create(follower_id: pavled.id, followee_id: luka.id)
Follow.create(follower_id: bojicd.id, followee_id: luka.id)
Follow.create(follower_id: drazendr.id, followee_id: luka.id)

# Posts
def post_helper(url, blur_level, password)
  uuid = SecureRandom.uuid
  imageLocked = MiniMagick::Image.open("https://picsum.photos/500/500?nocache=" + SecureRandom.base64(5))
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
hedgehog.save

# Post likes
PostLike.create(user_id: drazendr.id, post_id: hedgehog.id)
PostLike.create(user_id: aleksa.id, post_id: hedgehog.id)
PostLike.create(user_id: luka.id, post_id: hedgehog.id)
PostLike.create(user_id: ivan.id, post_id: hedgehog.id)
PostLike.create(user_id: pavled.id, post_id: hedgehog.id)

# Unlocks
Unlock.create(user_id: luka.id, post_id: hedgehog.id)
Unlock.create(user_id: pavled.id, post_id: hedgehog.id)
Unlock.create(user_id: drazendr.id, post_id: hedgehog.id)

# Comments
adorable_comment = Comment.create(post_id: hedgehog.id, user_id: ivan.id, comment_text: 'Adorable!')
Comment.create(post_id: hedgehog.id, user_id: tasha.id, parent_comment_id: adorable_comment.id, comment_text: 'I know, right')

# Comment likes
CommentLike.create(user_id: tasha.id, comment_id: adorable_comment.id)