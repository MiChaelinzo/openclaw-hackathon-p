import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Star } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { Skill } from '@/lib/types'

interface WriteReviewDialogProps {
  skill: Skill
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (review: { rating: number; title: string; comment: string }) => void
}

export function WriteReviewDialog({ skill, open, onOpenChange, onSubmit }: WriteReviewDialogProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0 || !comment.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit({ rating, title: title.trim(), comment: comment.trim() })
      setRating(0)
      setTitle('')
      setComment('')
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setRating(0)
    setTitle('')
    setComment('')
    onOpenChange(false)
  }

  const isValid = rating > 0 && comment.trim().length >= 20

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience with {skill.name} to help others make informed decisions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <Label className="text-base font-medium mb-3 block">Overall Rating *</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(value => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  <Star
                    size={36}
                    weight={value <= (hoveredRating || rating) ? 'fill' : 'regular'}
                    className={cn(
                      'transition-colors',
                      value <= (hoveredRating || rating) ? 'text-warning' : 'text-muted-foreground'
                    )}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm font-medium">
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </span>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="review-title" className="text-base font-medium">
              Review Title (Optional)
            </Label>
            <p className="text-xs text-muted-foreground mb-2">
              Summarize your experience in a few words
            </p>
            <Input
              id="review-title"
              placeholder="e.g., Game changer for my workflow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {title.length}/100
            </p>
          </div>

          <div>
            <Label htmlFor="review-comment" className="text-base font-medium">
              Your Review *
            </Label>
            <p className="text-xs text-muted-foreground mb-2">
              Share detailed feedback about what you liked or disliked (minimum 20 characters)
            </p>
            <Textarea
              id="review-comment"
              placeholder="Tell others about your experience with this skill. What problems did it solve? How was the quality? Would you recommend it?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[150px] resize-none"
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {comment.length}/2000 {comment.length < 20 && `(${20 - comment.length} more characters needed)`}
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <p className="font-medium mb-2">Review Guidelines:</p>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>• Be honest and specific about your experience</li>
              <li>• Focus on the skill's functionality and quality</li>
              <li>• Avoid profanity or personal attacks</li>
              <li>• Reviews cannot be edited after submission</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
