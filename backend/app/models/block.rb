class Block < ApplicationRecord
  belongs_to :blocker
  belongs_to :blockee
end
