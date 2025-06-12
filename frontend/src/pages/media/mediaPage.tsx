import React, { useEffect, useState } from 'react';
import { getMediaList, getTaggedMediaList, type InstagramMedia } from '../../apis/getMediaList';
import { format } from 'date-fns';
import { FaInstagram, FaHeart, FaComment } from 'react-icons/fa';
import { HiExternalLink } from 'react-icons/hi';
import * as S from '../../styles/media/mediaPage.styles';
import axios from 'axios';
import { useNavigate } from 'react-router';

const API_URL = 'http://localhost:3000';

const formatNumber = (num?: number): string => {
  if (!num) return '0';
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const MediaPage: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<InstagramMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        
        // Get user ID from localStorage
        const userId = localStorage.getItem('instagram_user_id');
        console.log('🔍 Frontend - User ID from localStorage:', userId);
        
        if (!userId) {
          throw new Error('Please log in first');
        }

        // Get the access token from the backend with userId
        const tokenResponse = await axios.get(`${API_URL}/instagram/token/${userId}`);
        console.log('🔑 Frontend - Received token response:', {
          userId,
          hasToken: !!tokenResponse.data.access_token,
          tokenPreview: tokenResponse.data.access_token ? 
            `${tokenResponse.data.access_token.substring(0, 10)}...` : 'none'
        });
        
        const { access_token } = tokenResponse.data;
        
        if (!access_token) {
          throw new Error('No access token found');
        }

        // Fetch both posted and tagged media
        const [postedResponse, taggedResponse] = await Promise.allSettled([
          getMediaList(access_token),
          getTaggedMediaList(access_token)
        ]);

        // Combine and sort media items by timestamp
        const allMedia = [
          ...(postedResponse.status === 'fulfilled' ? postedResponse.value.data : []),
          ...(taggedResponse.status === 'fulfilled' ? taggedResponse.value.data : [])
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        // Log any errors but don't fail completely
        if (postedResponse.status === 'rejected') {
          console.error('Failed to fetch posted media:', postedResponse.reason);
        }
        if (taggedResponse.status === 'rejected') {
          console.error('Failed to fetch tagged media:', taggedResponse.reason);
          if (axios.isAxiosError(taggedResponse.reason) && taggedResponse.reason.response?.status === 403) {
            console.log('🔒 Missing tagged media permission. Please re-authenticate.');
          }
        }

        setMediaItems(allMedia);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch media';
        setError(errorMessage);
        
        // If user is not logged in, redirect to login
        if (errorMessage === 'Please log in first') {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [navigate]);

  if (loading) {
    return (
      <S.LoadingContainer>
        <S.Spinner />
      </S.LoadingContainer>
    );
  }

  if (error) {
    return <S.ErrorMessage>{error}</S.ErrorMessage>;
  }

  return (
    <S.Container>
      <S.Header>
        <S.Title>Instagram Media Dashboard</S.Title>
        <S.Subtitle>
          Showing {mediaItems.length} media items from your Instagram account
        </S.Subtitle>
      </S.Header>

      <S.Grid>
        {mediaItems.map((item) => (
          <S.Card key={item.id}>
            <S.MediaImage
              src={item.thumbnail_url || item.media_url}
              alt={item.caption || 'Instagram media'}
            />
            <S.CardContent>
              <S.MediaInfo>
                <S.MediaType>
                  <FaInstagram />
                  {item.media_type}
                  {item.is_carousel && (
                    <S.CarouselBadge>
                      +{item.child_count}
                    </S.CarouselBadge>
                  )}
                  {item.isTagged && (
                    <S.TaggedBadge>Tagged</S.TaggedBadge>
                  )}
                </S.MediaType>
                <S.Timestamp>
                  {format(new Date(item.timestamp), 'MMM d, yyyy')}
                </S.Timestamp>
              </S.MediaInfo>
              {item.caption && <S.Caption>{item.caption}</S.Caption>}
              <S.Stats>
                <S.StatItem>
                  <FaHeart />
                  {formatNumber(item.like_count)}
                </S.StatItem>
                <S.StatItem>
                  <FaComment />
                  {formatNumber(item.comments_count)}
                </S.StatItem>
              </S.Stats>
              <S.LinkButton
                href={item.permalink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <HiExternalLink size={20} />
              </S.LinkButton>
            </S.CardContent>
          </S.Card>
        ))}
      </S.Grid>
    </S.Container>
  );
};

export default MediaPage;