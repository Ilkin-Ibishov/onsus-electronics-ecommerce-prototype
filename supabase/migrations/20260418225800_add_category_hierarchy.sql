-- Add parent_id column to categories table for hierarchy
ALTER TABLE categories ADD COLUMN parent_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- Index for performance
CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-- Update RLS (already enabled, so parents are visible to all if public)
-- No changes needed to policies if they are set to true for select.

-- Seed some sub-categories for demonstration
DO $$
DECLARE
    electronics_id UUID;
    smartphones_id UUID;
    laptops_id UUID;
    headphones_id UUID;
BEGIN
    SELECT id INTO electronics_id FROM categories WHERE slug = 'consumer-electronics';
    
    IF electronics_id IS NOT NULL THEN
        -- Link existing categories that should be children
        UPDATE categories SET parent_id = electronics_id WHERE slug IN ('smartphones', 'headphones', 'smartwatches', 'cameras', 'laptops-tablets', 'gaming');
        
        -- Add deeper sub-categories if needed for Mega Menu demo
        -- Example: Smartphones -> Android, iPhone
        -- (Optional, current categories are mostly top level. We can just keep it 1-level deep for now)
    END IF;
END $$;
