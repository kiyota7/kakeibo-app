module Api
  class TransactionsController < ApplicationController
    before_action :set_transaction, only: [:update, :destroy]

    def index
      transactions = Transaction.includes(:category).order(date: :desc, id: :desc)
      transactions = transactions.where(date: params[:from]..params[:to]) if params[:from].present? && params[:to].present?
      transactions = transactions.where(category_id: params[:category_id]) if params[:category_id].present?
      render json: transactions.as_json(include: { category: { only: [:id, :name, :kind] } })
    end

    def create
      transaction = Transaction.new(transaction_params)
      if transaction.save
        render json: transaction.as_json(include: { category: { only: [:id, :name, :kind] } }), status: :created
      else
        render json: { errors: transaction.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      if @transaction.update(transaction_params)
        render json: @transaction.as_json(include: { category: { only: [:id, :name, :kind] } })
      else
        render json: { errors: @transaction.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @transaction.destroy
      head :no_content
    end

    private

    def set_transaction
      @transaction = Transaction.find(params[:id])
    end

    def transaction_params
      params.require(:transaction).permit(:category_id, :date, :amount, :memo)
    end
  end
end
