# frozen_string_literal: true

class ApiDocsController < ActionController::Base
  def index
    render inline: <<~HTML, content_type: 'text/html'
      <!doctype html>
      <html>
        <head>
          <title>Victus API</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body>
          <script id="api-reference" data-url="/api-docs/v1/swagger.yaml"></script>
          <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.28.12"></script>
        </body>
      </html>
    HTML
  end
end
