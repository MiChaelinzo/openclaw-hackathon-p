import { useState, useMemo, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown,
  SealCheck,
  ChatCircle,
  SortAscending,
  Funnel
} from '@phosphor-icons/react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Review, ReviewStats, Skill } from '@/lib/types'
import { cn } from '@/lib/utils'

interface SkillReviewsProps {
  skill: Skill
  reviews: Review[]
  userHasReviewed: boolean
  onWriteReview: () => void
}

type SortOption = 'recent' | 'helpful' | 'rating-high' | 'rating-low'
type FilterOption = 'all' | '5' | '4' | '3' | '2' | '1' | 'verified'

export function SkillReviews({ skill, reviews, userHasReviewed, onWriteReview }: SkillReviewsProps) {
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [helpfulVotes, setHelpfulVotes] = useKV<Record<string, 'helpful' | 'notHelpful'>>('review-votes', {})

  const reviewStats: ReviewStats = useMemo(() => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    let totalRating = 0

    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++
      totalRating += review.rating
    })

    return {
      averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
      totalReviews: reviews.length,
      ratingDistribution: distribution
    }
  }, [reviews])

  const filteredAndSortedReviews = useMemo(() => {
    let filtered = [...reviews]

    if (filterBy !== 'all') {
      if (filterBy === 'verified') {
        filtered = filtered.filter(r => r.verified)
      } else {
        const rating = parseInt(filterBy)
        filtered = filtered.filter(r => r.rating === rating)
      }
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return b.timestamp - a.timestamp
        case 'helpful':
          return (b.helpful - b.notHelpful) - (a.helpful - a.notHelpful)
        case 'rating-high':
          return b.rating - a.rating
        case 'rating-low':
          return a.rating - b.rating
        default:
          return 0
      }
    })

    return filtered
  }, [reviews, sortBy, filterBy])

  const handleVote = (reviewId: string, vote: 'helpful' | 'notHelpful') => {
    setHelpfulVotes(current => {
      const votes = current || {}
      const existing = votes[reviewId]
      if (existing === vote) {
        const updated = { ...votes }
        delete updated[reviewId]
        return updated
      }
      return { ...votes, [reviewId]: vote }
    })
  }

  const getVoteCount = (review: Review, voteType: 'helpful' | 'notHelpful') => {
    let count = voteType === 'helpful' ? review.helpful : review.notHelpful
    
    Object.entries(helpfulVotes || {}).forEach(([id, vote]) => {
      if (id === review.id) {
        if (vote === voteType) count++
        else count--
      }
    })

    return Math.max(0, count)
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center justify-center gap-2 md:w-48">
            <div className="text-[48px] font-bold leading-none">
              {reviewStats.averageRating.toFixed(1)}
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Star
                  key={i}
                  size={20}
                  weight={i <= Math.round(reviewStats.averageRating) ? 'fill' : 'regular'}
                  className={cn(
                    i <= Math.round(reviewStats.averageRating) ? 'text-warning' : 'text-muted-foreground'
                  )}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          <Separator orientation="vertical" className="hidden md:block" />

          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution]
              const percentage = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0

              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star size={14} weight="fill" className="text-warning" />
                  </div>
                  <Progress value={percentage} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
                </div>
              )
            })}
          </div>

          <Separator orientation="vertical" className="hidden md:block" />

          <div className="flex items-center md:w-48">
            <Button 
              onClick={onWriteReview} 
              className="w-full"
              disabled={userHasReviewed}
            >
              <ChatCircle size={20} className="mr-2" />
              {userHasReviewed ? 'Already Reviewed' : 'Write Review'}
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between gap-4">
        <h3 className="text-[20px] font-semibold leading-[26px]">
          Reviews ({filteredAndSortedReviews.length})
        </h3>

        <div className="flex items-center gap-2">
          <Select value={filterBy} onValueChange={(v) => setFilterBy(v as FilterOption)}>
            <SelectTrigger className="w-[140px] h-9">
              <Funnel size={16} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
              <SelectItem value="verified">Verified Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[140px] h-9">
              <SortAscending size={16} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
              <SelectItem value="rating-high">Highest Rating</SelectItem>
              <SelectItem value="rating-low">Lowest Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAndSortedReviews.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-4 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <ChatCircle size={32} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {filterBy === 'all' 
                ? 'Be the first to review this skill and help others make informed decisions'
                : 'No reviews match your current filter. Try adjusting your filters.'
              }
            </p>
          </div>
          {filterBy === 'all' && !userHasReviewed && (
            <Button onClick={onWriteReview}>
              Write the First Review
            </Button>
          )}
        </Card>
      ) : (
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {filteredAndSortedReviews.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
                userVote={helpfulVotes?.[review.id]}
                onVote={handleVote}
                getVoteCount={getVoteCount}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

interface ReviewCardProps {
  review: Review
  userVote?: 'helpful' | 'notHelpful'
  onVote: (reviewId: string, vote: 'helpful' | 'notHelpful') => void
  getVoteCount: (review: Review, voteType: 'helpful' | 'notHelpful') => number
}

function ReviewCard({ review, userVote, onVote, getVoteCount }: ReviewCardProps) {
  const helpfulCount = getVoteCount(review, 'helpful')
  const notHelpfulCount = getVoteCount(review, 'notHelpful')

  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={review.userAvatar} />
          <AvatarFallback>
            {review.userName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm">{review.userName}</h4>
                {review.verified && (
                  <Badge variant="secondary" className="gap-1 text-xs h-5">
                    <SealCheck size={12} weight="fill" />
                    Verified Purchase
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      size={14}
                      weight={i <= review.rating ? 'fill' : 'regular'}
                      className={cn(
                        i <= review.rating ? 'text-warning' : 'text-muted-foreground'
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {review.title && (
            <h5 className="font-medium text-sm mb-2">{review.title}</h5>
          )}

          <p className="text-sm text-foreground leading-relaxed mb-4">
            {review.comment}
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={userVote === 'helpful' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onVote(review.id, 'helpful')}
                className="gap-1.5 h-8"
              >
                <ThumbsUp size={14} weight={userVote === 'helpful' ? 'fill' : 'regular'} />
                Helpful ({helpfulCount})
              </Button>
              <Button
                variant={userVote === 'notHelpful' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => onVote(review.id, 'notHelpful')}
                className="gap-1.5 h-8"
              >
                <ThumbsDown size={14} weight={userVote === 'notHelpful' ? 'fill' : 'regular'} />
                ({notHelpfulCount})
              </Button>
            </div>

            {review.updatedAt && review.updatedAt !== review.timestamp && (
              <span className="text-xs text-muted-foreground">
                (Edited)
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
