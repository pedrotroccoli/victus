module RateLimited
  extend ActiveSupport::Concern

  private

  def render_rate_limited(retry_after: 60)
    response.headers["Retry-After"] = retry_after.to_s
    render json: { error: "Rate limit exceeded. Try again later." }, status: :too_many_requests
  end
end
