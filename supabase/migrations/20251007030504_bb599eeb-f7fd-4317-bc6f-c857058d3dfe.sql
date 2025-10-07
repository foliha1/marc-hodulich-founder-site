-- Make carousel caption/subcaption nullable with empty string defaults
ALTER TABLE carousel_slides 
  ALTER COLUMN caption DROP NOT NULL,
  ALTER COLUMN caption SET DEFAULT '',
  ALTER COLUMN subcaption DROP NOT NULL,
  ALTER COLUMN subcaption SET DEFAULT '';