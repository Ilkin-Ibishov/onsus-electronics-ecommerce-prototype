-- Add image_gallery column to products
ALTER TABLE products ADD COLUMN image_gallery text[] DEFAULT '{}';

-- Update some seed data with dummy gallery images (Pexels placeholders)
UPDATE products 
SET image_gallery = ARRAY[
  image_url,
  'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/4065906/pexels-photo-4065906.jpeg?auto=compress&cs=tinysrgb&w=400'
]
WHERE image_url IS NOT NULL;
