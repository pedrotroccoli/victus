class DateInternal
  def self.parse(date, fallback = nil)
    Date.parse(date)
  rescue => e
    fallback || Date.today
  end
end
