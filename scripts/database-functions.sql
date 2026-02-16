-- Function to increment lyric views
CREATE OR REPLACE FUNCTION increment_lyric_views(lyric_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE lyrics
  SET views = views + 1
  WHERE id = lyric_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get artist by slug with lyric count
CREATE OR REPLACE FUNCTION get_artist_with_count(artist_slug text)
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  bio text,
  avatar_url text,
  verified_status boolean,
  genres text[],
  created_at timestamp,
  lyric_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.name,
    a.slug,
    a.bio,
    a.avatar_url,
    a.verified_status,
    a.genres,
    a.created_at,
    COUNT(l.id) as lyric_count
  FROM artists a
  LEFT JOIN lyrics l ON a.id = l.artist_id
  WHERE a.slug = artist_slug
  GROUP BY a.id;
END;
$$ LANGUAGE plpgsql;
