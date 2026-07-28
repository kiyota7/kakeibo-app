# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

expense_categories = ["食費", "交通費", "日用品", "娯楽", "住居費", "その他支出"]
income_categories = ["給与", "その他収入"]

expense_categories.each do |name|
  Category.find_or_create_by!(name: name, kind: "expense")
end

income_categories.each do |name|
  Category.find_or_create_by!(name: name, kind: "income")
end
