module Api
  class SummariesController < ApplicationController
    # GET /api/summary/monthly?year=2026&month=7
    def monthly
      year = params.require(:year).to_i
      month = params.require(:month).to_i
      range = Date.new(year, month, 1).beginning_of_month..Date.new(year, month, 1).end_of_month

      totals = Transaction.joins(:category)
                          .where(date: range)
                          .group("categories.kind")
                          .sum(:amount)

      income_total = totals["income"] || 0
      expense_total = totals["expense"] || 0

      render json: {
        year: year,
        month: month,
        income_total: income_total,
        expense_total: expense_total,
        balance: income_total - expense_total
      }
    end

    # GET /api/summary/by_category?from=2026-07-01&to=2026-07-31&category_id=1
    def by_category
      from = params.require(:from)
      to = params.require(:to)

      scope = Transaction.joins(:category).where(date: from..to)
      scope = scope.where(category_id: params[:category_id]) if params[:category_id].present?

      rows = scope.group("categories.id", "categories.name", "categories.kind").sum(:amount)

      result = rows.map do |(category_id, name, kind), total|
        { category_id: category_id, name: name, kind: kind, total: total }
      end

      render json: result
    end
  end
end
