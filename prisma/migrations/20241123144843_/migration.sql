CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX "RecipeModel_title_trgm_idx" ON "RecipeModel" USING gin ("title" gin_trgm_ops);