class Category < ApplicationRecord
  enum :kind, { expense: "expense", income: "income" }

  has_many :transactions, dependent: :restrict_with_error

  validates :name, presence: true, uniqueness: { scope: :kind }
  validates :kind, presence: true
end
