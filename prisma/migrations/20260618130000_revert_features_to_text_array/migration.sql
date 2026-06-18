-- Revert features column from jsonb back to text[]
-- Must drop default first, alter type, then restore default

CREATE OR REPLACE FUNCTION temporal_jsonb_array_to_text_array(j jsonb)
RETURNS text[]
LANGUAGE sql IMMUTABLE AS
$$
  SELECT COALESCE(array_agg(elem), '{}'::text[]) FROM jsonb_array_elements_text(j) AS elem;
$$;

ALTER TABLE "platform_packages" ALTER COLUMN "features" DROP DEFAULT;

ALTER TABLE "platform_packages"
  ALTER COLUMN "features" TYPE text[]
  USING temporal_jsonb_array_to_text_array("features");

ALTER TABLE "platform_packages"
  ALTER COLUMN "features" SET DEFAULT '{}'::text[];

DROP FUNCTION temporal_jsonb_array_to_text_array;
