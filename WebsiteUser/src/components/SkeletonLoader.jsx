import styled from 'styled-components';

const SkeletonCard = styled.div`
  background-color: #333;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  height: 100%;

  .skeleton-title {
    background: #444;
    width: 60%;
    height: 1.5rem;
    border-radius: 8px;
    margin-bottom: 0.5rem;
  }

  .skeleton-text {
    background: #444;
    height: 1rem;
    border-radius: 8px;
    margin-bottom: 0.5rem;
  }

  .skeleton-thumbnail {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #444;
    margin-right: 8px;
  }
`;

export const SkeletonLoader = () => (
  <SkeletonCard>
    <div className="skeleton-title"></div>
    <div className="skeleton-text"></div>
    <div className="skeleton-text"></div>
    <div className="skeleton-thumbnail"></div>
  </SkeletonCard>
);
