require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Myapp
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0

    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore, key: 'blurr_session', secure: (ENV['RAILS_SAMESITE'] == 'none')
    config.action_dispatch.cookies_same_site_protection = (ENV['RAILS_SAMESITE'] == 'none') ? :none : :lax

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
    config.api_only = true

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins 'http://localhost:3000', 'https://blurr.social', 'https://blurr.azurewebsites.net'
        resource '*',
          headers: :any,
          methods: [:get, :post, :put, :delete, :options, :patch],
          credentials: true
      end
    end
  end
end
