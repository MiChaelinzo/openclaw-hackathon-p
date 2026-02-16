# User Reviews & Rating System

## Overview

The AgentDev Studio marketplace includes a comprehensive user review and rating system that enables community-driven quality validation of skills. This system helps users make informed decisions about which skills to install and provides skill creators with valuable feedback.

## Features

### 1. Rating System
- **5-Star Scale**: Users can rate skills from 1 to 5 stars
- **Visual Indicators**: Stars are displayed throughout the UI with filled/unfilled states
- **Average Ratings**: Skill cards and detail pages show computed average ratings
- **Rating Distribution**: Detailed breakdown showing how many users gave each star rating

### 2. Review Submission

#### Requirements
- **Rating**: Required (1-5 stars)
- **Comment**: Required (minimum 20 characters, maximum 2000 characters)
- **Title**: Optional (maximum 100 characters)
- **One Review Per User Per Skill**: Users can only submit one review per skill

#### Verified Purchase Badge
Reviews from users who have installed the skill are marked with a "Verified Purchase" badge, adding credibility to the feedback.

#### Review Guidelines
- Be honest and specific about your experience
- Focus on the skill's functionality and quality
- Avoid profanity or personal attacks
- Reviews cannot be edited after submission

### 3. Review Display

#### Sorting Options
- **Most Recent**: Shows newest reviews first (default)
- **Most Helpful**: Sorts by helpful votes minus not helpful votes
- **Highest Rating**: Shows 5-star reviews first
- **Lowest Rating**: Shows 1-star reviews first

#### Filtering Options
- **All Reviews**: Show all reviews (default)
- **5 Stars**: Show only 5-star reviews
- **4 Stars**: Show only 4-star reviews
- **3 Stars**: Show only 3-star reviews
- **2 Stars**: Show only 2-star reviews
- **1 Star**: Show only 1-star reviews
- **Verified Only**: Show only verified purchase reviews

### 4. Review Voting

Users can vote on reviews to indicate whether they found them helpful or not helpful:
- **Helpful**: Thumbs up button
- **Not Helpful**: Thumbs down button
- **Vote Tracking**: Each user can only vote once per review
- **Vote Toggle**: Clicking the same vote again removes it
- **Vote Display**: Shows count of helpful and not helpful votes

### 5. Review Statistics

The review overview displays:
- **Average Rating**: Large prominently displayed number (e.g., 4.8)
- **Total Reviews**: Count of all reviews for the skill
- **Star Distribution**: Visual progress bars showing percentage distribution across 1-5 stars
- **Quick Write Button**: Easy access to submit a review

## User Interface

### Skill Details - Reviews Tab

The Reviews tab in skill details includes:
1. **Statistics Card**: Average rating, total count, distribution chart, write review button
2. **Filter & Sort Controls**: Dropdowns for filtering and sorting reviews
3. **Review List**: Scrollable list of review cards

### Review Card Components

Each review card shows:
- **User Avatar**: Visual identifier for reviewer
- **User Name**: Display name of reviewer
- **Verified Badge**: If user has purchased/installed the skill
- **Star Rating**: Visual 1-5 star display
- **Review Date**: When the review was posted
- **Review Title**: Optional headline (if provided)
- **Review Comment**: Full text of the review
- **Helpful/Not Helpful Buttons**: With vote counts
- **Edit Indicator**: "(Edited)" tag if review was modified

### Write Review Dialog

Modal dialog with:
- **Interactive Star Selector**: Large clickable stars with hover effect
- **Rating Label**: Descriptive text (Poor, Fair, Good, Very Good, Excellent)
- **Title Input**: Optional field with character counter (0/100)
- **Comment Textarea**: Required field with character counter and minimum indicator
- **Review Guidelines**: Inline tips for writing good reviews
- **Submit/Cancel Buttons**: Action buttons with validation

## Data Persistence

Reviews are stored using the `useKV` persistence API with the following keys:

### Storage Keys
- `skill-reviews`: Array of all reviews across all skills
- `user-skill-reviews`: Map of user's submitted reviews by skill ID
- `review-votes`: Map of user's helpful/not helpful votes by review ID

### Review Data Structure
```typescript
interface Review {
  id: string                    // Unique review identifier
  skillId: string               // Associated skill ID
  userId: string                // Reviewer's user ID
  userName: string              // Reviewer's display name
  userAvatar?: string           // Optional avatar URL
  rating: number                // 1-5 star rating
  title: string                 // Optional review title
  comment: string               // Review text
  helpful: number               // Count of helpful votes
  notHelpful: number            // Count of not helpful votes
  verified: boolean             // Whether user has installed skill
  timestamp: number             // When review was created
  updatedAt?: number            // When review was last modified
}
```

## Sample Reviews

The system ships with 20 sample reviews across marketplace skills to demonstrate the review system functionality. These reviews:
- Cover all 14 marketplace skills
- Include ratings from 4-5 stars
- Feature realistic, detailed feedback
- Show varying levels of helpfulness votes
- Include both verified and unverified purchases

## Integration Points

### Skill Details Component
- Imports `SkillReviews` and `WriteReviewDialog` components
- Manages review state with `useKV`
- Handles review submission
- Tracks user's review status per skill

### Marketplace Integration
- Skills show average rating and review count on cards
- Featured skills require high ratings (4.5+)
- Review count displayed alongside download stats

### User Authentication
- Integrates with `spark.user()` API to get current user info
- User's GitHub login and avatar used in reviews
- User ID used to prevent duplicate reviews and track votes

## Future Enhancements

Potential improvements for the review system:
- Edit/delete own reviews
- Report inappropriate reviews
- Developer responses to reviews
- Review images/screenshots
- Review reactions (beyond helpful/not helpful)
- Review threads/replies
- Email notifications for new reviews on owned skills
- Review moderation tools
- Verified skill creator badge
- Review analytics for skill authors
