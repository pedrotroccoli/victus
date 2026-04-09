module RateLimited
  extend ActiveSupport::Concern

  private

  def render_rate_limited
    response.headers["Retry-After"] = "60"
    render json: { error: "Rate limit exceeded. Try again later." }, status: :too_many_requests
  end
end
