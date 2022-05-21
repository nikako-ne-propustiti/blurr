# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 0) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "blocks", primary_key: :serial, force: :cascade do |t|
    t.integer "blocker_id", null: false
    t.integer "blockee_id", null: false
    t.datetime "created_at", default: -> { "now()" }
  end

  create_table "comment_likes", primary_key: :serial, force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "comment_id", null: false
    t.datetime "created_at", default: -> { "now()" }
  end

  create_table "comments", id: :serial, force: :cascade do |t|
    t.string "comment_text", limit: 255, null: false
    t.integer "post_id", null: false
    t.integer "parent_comment_id"
    t.integer "user_id", null: false
    t.datetime "created_at", default: -> { "now()" }
  end

  create_table "follows", primary_key: :serial, force: :cascade do |t|
    t.integer "follower_id", null: false
    t.integer "followee_id", null: false
    t.datetime "created_at", default: -> { "now()" }
  end

  create_table "hashtags", primary_key: :serial, force: :cascade do |t|
    t.integer "post_id", null: false
    t.string "tag_name", limit: 32, null: false
  end

  create_table "post_likes", primary_key: :serial, force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "post_id", null: false
    t.datetime "created_at", default: -> { "now()" }
  end

  create_table "posts", id: :serial, force: :cascade do |t|
    t.string "post_url", limit: 16, null: false
    t.uuid "file_uuid", null: false
    t.string "description", limit: 255, default: "", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", default: -> { "now()" }
    t.string "password", limit: 32, null: false
    t.boolean "reviewed", default: false, null: false
    t.boolean "sponsored", default: false, null: false
    t.index ["post_url"], name: "posts_post_url_key", unique: true
  end

  create_table "unlocks", primary_key: :serial, force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "post_id", null: false
    t.datetime "created_at", default: -> { "now()" }
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "username", limit: 255, null: false
    t.string "real_name", limit: 255, null: false
    t.datetime "created_at", default: -> { "now()" }
    t.string "password_digest", limit: 255, null: false
    t.uuid "profile_photo_uuid"
    t.boolean "is_admin", default: false, null: false
    t.index ["username"], name: "users_username_key", unique: true
  end

  add_foreign_key "blocks", "users", column: "blockee_id", name: "blocks_blockee_id_fkey", on_delete: :cascade
  add_foreign_key "blocks", "users", column: "blocker_id", name: "blocks_blocker_id_fkey", on_delete: :cascade
  add_foreign_key "comment_likes", "comments", name: "comment_likes_comment_id_fkey", on_delete: :cascade
  add_foreign_key "comment_likes", "users", name: "comment_likes_user_id_fkey", on_delete: :cascade
  add_foreign_key "comments", "comments", column: "parent_comment_id", name: "comments_parent_comment_id_fkey", on_delete: :cascade
  add_foreign_key "comments", "posts", name: "comments_post_id_fkey", on_delete: :cascade
  add_foreign_key "comments", "users", name: "comments_user_id_fkey", on_delete: :cascade
  add_foreign_key "follows", "users", column: "followee_id", name: "follows_followee_id_fkey", on_delete: :cascade
  add_foreign_key "follows", "users", column: "follower_id", name: "follows_follower_id_fkey", on_delete: :cascade
  add_foreign_key "hashtags", "posts", name: "hashtags_post_id_fkey", on_delete: :cascade
  add_foreign_key "post_likes", "posts", name: "post_likes_post_id_fkey", on_delete: :cascade
  add_foreign_key "post_likes", "users", name: "post_likes_user_id_fkey", on_delete: :cascade
  add_foreign_key "posts", "users", name: "posts_user_id_fkey", on_delete: :cascade
  add_foreign_key "unlocks", "posts", name: "unlocks_post_id_fkey", on_delete: :cascade
  add_foreign_key "unlocks", "users", name: "unlocks_user_id_fkey", on_delete: :cascade
  add_index :blocks, [:blocker_id, :blockee_id], unique: true
  add_index :follows, [:follower_id, :followee_id], unique: true
  add_index :post_likes, [:user_id, :post_id], unique: true
  add_index :unlocks, [:user_id, :post_id], unique: true

end
