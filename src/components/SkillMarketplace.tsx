import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MagnifyingGlass, 
  Download, 
  Star, 
  CaretDown,
  Funnel,
  SealCheck,
  Code,
  Sparkle,
  Tag,
  TrendUp,
  Crown
} from '@phosphor-icons/react'
import type { Skill } from '@/lib/types'
import { cn } from '@/lib/utils'

interface SkillMarketplaceProps {
  skills: Skill[]
  installedSkills: Skill[]
  onInstallSkill: (skill: Skill) => void
  onViewDetails: (skill: Skill) => void
}

type SortOption = 'popular' | 'recent' | 'rating' | 'name'
type FilterCategory = 'all' | string

export function SkillMarketplace({ 
  skills, 
  installedSkills,
  onInstallSkill, 
  onViewDetails 
}: SkillMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all')
  const [sortBy, setSortBy] = useState<SortOption>('popular')
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all')

  const categories = useMemo(() => {
    const cats = Array.from(new Set(skills.map(s => s.category)))
    return ['all', ...cats]
  }, [skills])

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    skills.forEach(skill => {
      skill.tags?.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [skills])

  const filteredAndSortedSkills = useMemo(() => {
    let filtered = skills.filter(skill => {
      const matchesSearch = 
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory

      const matchesPremium = !showPremiumOnly || skill.isPremium

      const matchesVerified = !showVerifiedOnly || skill.isVerified

      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => skill.tags?.includes(tag))

      const matchesPrice = 
        priceFilter === 'all' ||
        (priceFilter === 'free' && (!skill.price || skill.price === 0)) ||
        (priceFilter === 'paid' && skill.price && skill.price > 0)

      return matchesSearch && matchesCategory && matchesPremium && matchesVerified && matchesTags && matchesPrice
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.downloads || 0) - (a.downloads || 0)
        case 'recent':
          return b.updatedAt - a.updatedAt
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }, [skills, searchQuery, selectedCategory, sortBy, showPremiumOnly, showVerifiedOnly, selectedTags, priceFilter])

  const featuredSkills = useMemo(() => {
    return skills
      .filter(s => s.isVerified && (s.rating || 0) >= 4.5)
      .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
      .slice(0, 3)
  }, [skills])

  const trendingSkills = useMemo(() => {
    return skills
      .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
      .slice(0, 6)
  }, [skills])

  const isInstalled = (skill: Skill) => {
    return installedSkills.some(s => s.id === skill.id)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setShowPremiumOnly(false)
    setShowVerifiedOnly(false)
    setSelectedTags([])
    setPriceFilter('all')
  }

  const activeFilterCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    (showPremiumOnly ? 1 : 0) +
    (showVerifiedOnly ? 1 : 0) +
    selectedTags.length +
    (priceFilter !== 'all' ? 1 : 0)

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-bold leading-[38px] tracking-[-0.02em]">
            Skill Marketplace
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Discover and install skills from the community
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Code size={16} />
          <span>{filteredAndSortedSkills.length} skills available</span>
        </div>
      </div>

      <Tabs defaultValue="browse" className="flex-1 flex flex-col">
        <TabsList className="w-fit">
          <TabsTrigger value="browse" className="gap-2">
            <MagnifyingGlass size={18} />
            Browse
          </TabsTrigger>
          <TabsTrigger value="featured" className="gap-2">
            <Sparkle size={18} weight="fill" />
            Featured
          </TabsTrigger>
          <TabsTrigger value="trending" className="gap-2">
            <TrendUp size={18} />
            Trending
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="flex-1 flex flex-col gap-4 mt-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlass 
                size={20} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
              />
              <Input
                placeholder="Search skills, tags, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Funnel size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <Select value={priceFilter} onValueChange={(v) => setPriceFilter(v as any)}>
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="free">Free Only</SelectItem>
                <SelectItem value="paid">Paid Only</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={showVerifiedOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
              className="gap-2 h-8"
            >
              <SealCheck size={16} weight={showVerifiedOnly ? 'fill' : 'regular'} />
              Verified
            </Button>

            <Button
              variant={showPremiumOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowPremiumOnly(!showPremiumOnly)}
              className="gap-2 h-8"
            >
              <Crown size={16} weight={showPremiumOnly ? 'fill' : 'regular'} />
              Premium
            </Button>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8"
              >
                Clear all ({activeFilterCount})
              </Button>
            )}
          </div>

          {allTags.length > 0 && (
            <div className="flex items-start gap-2">
              <Tag size={18} className="text-muted-foreground mt-1" />
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-primary/20"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-auto">
            {filteredAndSortedSkills.length === 0 ? (
              <Card className="flex flex-col items-center justify-center gap-4 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <MagnifyingGlass size={32} className="text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">No skills found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Try adjusting your search or filters to find what you're looking for
                  </p>
                </div>
                {activeFilterCount > 0 && (
                  <Button onClick={clearFilters} variant="outline">
                    Clear all filters
                  </Button>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedSkills.map(skill => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    isInstalled={isInstalled(skill)}
                    onInstall={() => onInstallSkill(skill)}
                    onViewDetails={() => onViewDetails(skill)}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="featured" className="flex-1 flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkle size={24} weight="fill" className="text-accent" />
            <h2 className="text-[24px] font-semibold leading-[30px] tracking-[-0.01em]">
              Featured Skills
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Hand-picked, verified skills with exceptional quality and ratings
          </p>
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-1 gap-4">
              {featuredSkills.map(skill => (
                <FeaturedSkillCard
                  key={skill.id}
                  skill={skill}
                  isInstalled={isInstalled(skill)}
                  onInstall={() => onInstallSkill(skill)}
                  onViewDetails={() => onViewDetails(skill)}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trending" className="flex-1 flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendUp size={24} className="text-success" />
            <h2 className="text-[24px] font-semibold leading-[30px] tracking-[-0.01em]">
              Trending Skills
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Most downloaded skills in the community right now
          </p>
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingSkills.map(skill => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  isInstalled={isInstalled(skill)}
                  onInstall={() => onInstallSkill(skill)}
                  onViewDetails={() => onViewDetails(skill)}
                />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface SkillCardProps {
  skill: Skill
  isInstalled: boolean
  onInstall: () => void
  onViewDetails: () => void
}

function SkillCard({ skill, isInstalled, onInstall, onViewDetails }: SkillCardProps) {
  return (
    <Card className="p-4 flex flex-col gap-3 hover:border-primary transition-colors cursor-pointer group" onClick={onViewDetails}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[16px] font-medium leading-[20px] group-hover:text-primary transition-colors truncate">
              {skill.name}
            </h3>
            {skill.isVerified && (
              <SealCheck size={16} weight="fill" className="text-accent flex-shrink-0" />
            )}
            {skill.isPremium && (
              <Crown size={16} weight="fill" className="text-warning flex-shrink-0" />
            )}
          </div>
          {skill.author && (
            <p className="text-xs text-muted-foreground">by {skill.author}</p>
          )}
        </div>
        {skill.price !== undefined && (
          <Badge variant={skill.price === 0 ? 'secondary' : 'default'} className="flex-shrink-0">
            {skill.price === 0 ? 'Free' : `$${skill.price}`}
          </Badge>
        )}
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
        {skill.description}
      </p>

      {skill.tags && skill.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {skill.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {skill.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{skill.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {skill.rating !== undefined && (
            <div className="flex items-center gap-1">
              <Star size={14} weight="fill" className="text-warning" />
              <span>{skill.rating.toFixed(1)}</span>
            </div>
          )}
          {skill.downloads !== undefined && (
            <div className="flex items-center gap-1">
              <Download size={14} />
              <span>{skill.downloads.toLocaleString()}</span>
            </div>
          )}
        </div>

        <Button
          size="sm"
          variant={isInstalled ? 'outline' : 'default'}
          onClick={(e) => {
            e.stopPropagation()
            if (!isInstalled) onInstall()
          }}
          disabled={isInstalled}
          className="h-7"
        >
          {isInstalled ? 'Installed' : 'Install'}
        </Button>
      </div>
    </Card>
  )
}

function FeaturedSkillCard({ skill, isInstalled, onInstall, onViewDetails }: SkillCardProps) {
  return (
    <Card className="p-6 flex flex-col md:flex-row gap-6 hover:border-primary transition-colors cursor-pointer group bg-card/50 backdrop-blur" onClick={onViewDetails}>
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-[20px] font-semibold leading-[26px] group-hover:text-primary transition-colors">
                {skill.name}
              </h3>
              {skill.isVerified && (
                <SealCheck size={20} weight="fill" className="text-accent" />
              )}
              {skill.isPremium && (
                <Crown size={20} weight="fill" className="text-warning" />
              )}
            </div>
            {skill.author && (
              <p className="text-sm text-muted-foreground">by {skill.author}</p>
            )}
          </div>
          {skill.price !== undefined && (
            <Badge variant={skill.price === 0 ? 'secondary' : 'default'} className="text-sm px-3 py-1">
              {skill.price === 0 ? 'Free' : `$${skill.price}`}
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">
          {skill.description}
        </p>

        {skill.tags && skill.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skill.tags.map(tag => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-6 pt-2 text-sm">
          {skill.rating !== undefined && (
            <div className="flex items-center gap-2">
              <Star size={18} weight="fill" className="text-warning" />
              <span className="font-medium">{skill.rating.toFixed(1)}</span>
              {skill.reviews !== undefined && (
                <span className="text-muted-foreground">({skill.reviews} reviews)</span>
              )}
            </div>
          )}
          {skill.downloads !== undefined && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Download size={18} />
              <span>{skill.downloads.toLocaleString()} downloads</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4">
          <Button
            variant={isInstalled ? 'outline' : 'default'}
            onClick={(e) => {
              e.stopPropagation()
              if (!isInstalled) onInstall()
            }}
            disabled={isInstalled}
            className="w-full md:w-auto"
          >
            {isInstalled ? 'Installed' : 'Install Skill'}
          </Button>
        </div>
      </div>
    </Card>
  )
}
