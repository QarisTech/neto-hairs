PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, data TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 0, version INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS inventory (product_id TEXT NOT NULL, option_key TEXT NOT NULL, available INTEGER NOT NULL DEFAULT 0 CHECK(available>=0), version INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(product_id,option_key));
CREATE TABLE IF NOT EXISTS customers (id TEXT PRIMARY KEY,email TEXT NOT NULL UNIQUE,name TEXT NOT NULL,phone TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS leads (id TEXT PRIMARY KEY,customer_id TEXT NOT NULL,product_id TEXT,message TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'new',notes TEXT NOT NULL DEFAULT '',follow_up TEXT,version INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS shipping (id TEXT PRIMARY KEY,state TEXT NOT NULL,city TEXT NOT NULL DEFAULT '',fee_kobo INTEGER NOT NULL CHECK(fee_kobo>=0),active INTEGER NOT NULL DEFAULT 1,version INTEGER NOT NULL DEFAULT 0,UNIQUE(state,city));
CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY,reference TEXT NOT NULL UNIQUE,token_hash TEXT NOT NULL,customer_id TEXT NOT NULL,items TEXT NOT NULL,address TEXT NOT NULL,subtotal_kobo INTEGER NOT NULL,shipping_kobo INTEGER NOT NULL,total_kobo INTEGER NOT NULL,currency TEXT NOT NULL DEFAULT 'NGN',payment_status TEXT NOT NULL DEFAULT 'pending',status TEXT NOT NULL DEFAULT 'awaiting_payment',stock_held INTEGER NOT NULL DEFAULT 1,expires_at TEXT NOT NULL,carrier TEXT NOT NULL DEFAULT '',tracking TEXT NOT NULL DEFAULT '',version INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL,paid_at TEXT);
CREATE TABLE IF NOT EXISTS refunds (id TEXT PRIMARY KEY,order_id TEXT NOT NULL,amount_kobo INTEGER NOT NULL,provider_id TEXT UNIQUE,status TEXT NOT NULL DEFAULT 'requested',reason TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY,email TEXT NOT NULL,expires_at TEXT NOT NULL,password_tag TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS limits (key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS audit (id TEXT PRIMARY KEY,actor TEXT NOT NULL,action TEXT NOT NULL,entity TEXT NOT NULL,details TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS leads_customer ON leads(customer_id);
CREATE INDEX IF NOT EXISTS orders_expiry ON orders(payment_status,expires_at);
CREATE TABLE IF NOT EXISTS outbox (id TEXT PRIMARY KEY,recipient TEXT NOT NULL,subject TEXT NOT NULL,body TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending',created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY,name TEXT NOT NULL,role TEXT NOT NULL,active INTEGER NOT NULL DEFAULT 1,password_hash TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS returns (id TEXT PRIMARY KEY,order_id TEXT NOT NULL UNIQUE,reason TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'requested',notes TEXT NOT NULL DEFAULT '',version INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS suppliers (id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT NOT NULL DEFAULT '',phone TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS purchases (id TEXT PRIMARY KEY,supplier_id TEXT NOT NULL,items TEXT NOT NULL,total_kobo INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'ordered',payment_status TEXT NOT NULL DEFAULT 'unpaid',version INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL,received_at TEXT);

-- Initial draft catalogue. Safe to rerun.
INSERT OR IGNORE INTO products(id,data) VALUES ('muse','{"id":"muse","name":"Black Deep Wave","type":"wig","texture":"wave","image":"deepwave","colour":"Natural black","price":null,"lengths":[16,18,20,22],"description":"Long, center-part black hair with defined deep waves.","variants":[{"inches":16,"grams":null,"price":null},{"inches":18,"grams":null,"price":null},{"inches":20,"grams":null,"price":null},{"inches":22,"grams":null,"price":null}]}');
INSERT OR IGNORE INTO inventory(product_id,option_key) VALUES ('muse','16:null');
INSERT OR IGNORE INTO inventory(product_id,option_key) VALUES ('muse','18:null');
INSERT OR IGNORE INTO inventory(product_id,option_key) VALUES ('muse','20:null');
INSERT OR IGNORE INTO inventory(product_id,option_key) VALUES ('muse','22:null');
INSERT OR IGNORE INTO products(id,data) VALUES ('sidecurl','{"id":"sidecurl","name":"Side-Part Curly Wig","type":"wig","texture":"curly","image":"sidecurl","colour":"Natural black","price":null,"lengths":[0],"description":"A swept side part and rounded black curls with an asymmetric shape.","variants":[{"inches":null,"grams":null,"price":null}]}');
INSERT OR IGNORE INTO inventory(product_id,option_key) VALUES ('sidecurl','null:null');
INSERT OR IGNORE INTO products(id,data) VALUES ('brown-deepwave','{"id":"brown-deepwave","name":"Brown Deep Wave","type":"wig","texture":"wave","image":"brown-deepwave","colour":"Brown","price":null,"lengths":[0],"description":"Long brown hair with defined waves and a side part.","variants":[{"inches":null,"grams":null,"price":null}]}');
INSERT OR IGNORE INTO inventory(product_id,option_key) VALUES ('brown-deepwave','null:null');
INSERT OR IGNORE INTO products(id,data) VALUES ('brown-curlybob','{"id":"brown-curlybob","name":"Brown Curly Bob","type":"wig","texture":"bob","image":"brown-curlybob","colour":"Brown","price":null,"lengths":[0],"description":"Brown shoulder-length curls with a swept side part.","variants":[{"inches":null,"grams":null,"price":null}]}');
INSERT OR IGNORE INTO inventory(product_id,option_key) VALUES ('brown-curlybob','null:null');
INSERT OR IGNORE INTO products(id,data) VALUES ('pixie-curls','{"id":"pixie-curls","name":"Short Pixie Curls","type":"wig","texture":"curly","image":"pixie-curls","colour":"Natural black","price":null,"lengths":[0],"description":"Short black curls shown on two mannequins.","variants":[{"inches":null,"grams":null,"price":null}]}');
INSERT OR IGNORE INTO inventory(product_id,option_key) VALUES ('pixie-curls','null:null');
INSERT OR IGNORE INTO products(id,data) VALUES ('shop-curlybob','{"id":"shop-curlybob","name":"Black Curly Bob","type":"wig","texture":"bob","image":"shop-curlybob","colour":"Natural black","price":null,"lengths":[0],"description":"A center-part black curly bob photographed in the Neto Hairs shop.","variants":[{"inches":null,"grams":null,"price":null}]}');
INSERT OR IGNORE INTO inventory(product_id,option_key) VALUES ('shop-curlybob','null:null');
INSERT OR IGNORE INTO products(id,data) VALUES ('black-waves','{"id":"black-waves","name":"Black Defined Waves","type":"wig","texture":"wave","image":"black-waves","colour":"Natural black","price":null,"lengths":[0],"description":"Black defined waves shown from the front and side.","variants":[{"inches":null,"grams":null,"price":null}]}');
INSERT OR IGNORE INTO inventory(product_id,option_key) VALUES ('black-waves','null:null');
INSERT OR IGNORE INTO products(id,data) VALUES ('straight-bob','{"id":"straight-bob","name":"Brown Straight Bob","type":"wig","texture":"straight","image":"straight-bob","colour":"Brown","price":null,"lengths":[0],"description":"A smooth brown bob with a side part and curved ends.","variants":[{"inches":null,"grams":null,"price":null}]}');
INSERT OR IGNORE INTO inventory(product_id,option_key) VALUES ('straight-bob','null:null');
INSERT OR IGNORE INTO products(id,data) VALUES ('loose-curls','{"id":"loose-curls","name":"Black Loose Curls","type":"wig","texture":"curly","image":"loose-curls","colour":"Natural black","price":null,"lengths":[0],"description":"Soft black curls shown on a foam mannequin with the Neto Hairs packaging.","variants":[{"inches":null,"grams":null,"price":null}]}');
INSERT OR IGNORE INTO inventory(product_id,option_key) VALUES ('loose-curls','null:null');

-- Additive homepage/media tables

CREATE TABLE IF NOT EXISTS media_assets(id TEXT PRIMARY KEY,kind TEXT NOT NULL,url TEXT NOT NULL,poster TEXT NOT NULL DEFAULT '',title TEXT NOT NULL,alt TEXT NOT NULL DEFAULT '',origin TEXT NOT NULL,public_id TEXT,provider_version TEXT,bytes INTEGER NOT NULL DEFAULT 0,archived INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS media_uploads(id TEXT PRIMARY KEY,kind TEXT NOT NULL,public_id TEXT NOT NULL,email TEXT NOT NULL,expires_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS site_pages(id TEXT PRIMARY KEY,draft_json TEXT NOT NULL,published_json TEXT NOT NULL,version INTEGER NOT NULL DEFAULT 0,published_revision INTEGER NOT NULL DEFAULT 0,published_at TEXT);

CREATE TABLE IF NOT EXISTS site_page_backups(id TEXT PRIMARY KEY,home_id TEXT NOT NULL,draft_json TEXT NOT NULL,published_json TEXT NOT NULL,version INTEGER NOT NULL,published_revision INTEGER NOT NULL,published_at TEXT,created_at TEXT NOT NULL);
