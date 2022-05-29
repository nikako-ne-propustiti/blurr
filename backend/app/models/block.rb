class Block < ApplicationRecord
  belongs_to :blocker, class_name: 'User'
  belongs_to :blockee, class_name: 'User'
end
