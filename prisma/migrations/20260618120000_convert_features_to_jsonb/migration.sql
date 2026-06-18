-- Revert: convert features from jsonb back to text[]
-- (removing the Neon adapter, native engine handles text[] correctly)

ALTER TABLE "platform_packages"
  ALTER COLUMN "features" TYPE text[]
  USING COALESCE(
    ARRAY(SELECT jsonb_array_elements_text("features")),
    '{}'::text[]
  );

ALTER TABLE "platform_packages"
  ALTER COLUMN "features" SET DEFAULT '{}'::text[];
