# -*- encoding: utf-8 -*-
# stub: bay_jekyll_theme 1.0.16 ruby lib

Gem::Specification.new do |s|
  s.name = "bay_jekyll_theme".freeze
  s.version = "1.0.16"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Eliott Vincent".freeze]
  s.date = "2021-02-23"
  s.email = ["hello@eliottvincent.com".freeze]
  s.homepage = "https://github.com/eliottvincent/bay".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "3.1.2".freeze
  s.summary = "A simple and minimal Jekyll theme..".freeze

  s.installed_by_version = "3.1.2" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_development_dependency(%q<jekyll>.freeze, ["~> 4.0"])
    s.add_development_dependency(%q<bundler>.freeze, ["~> 2.0"])
  else
    s.add_dependency(%q<jekyll>.freeze, ["~> 4.0"])
    s.add_dependency(%q<bundler>.freeze, ["~> 2.0"])
  end
end
