class Comment < ApplicationRecord
  belongs_to :post
  belongs_to :parent_comment
  belongs_to :user

  def get_json(user)
    # TODO: Implement
    return {}
  end
end
