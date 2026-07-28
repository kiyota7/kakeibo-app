class CreateTransactions < ActiveRecord::Migration[8.1]
  def change
    create_table :transactions do |t|
      t.references :category, null: false, foreign_key: true
      t.date :date, null: false
      t.integer :amount, null: false
      t.text :memo

      t.timestamps
    end
  end
end
