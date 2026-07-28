class Transaction < ApplicationRecord
  belongs_to :category

  validates :date, presence: true
  validates :amount, presence: true, numericality: { only_integer: true, greater_than: 0 }
end
