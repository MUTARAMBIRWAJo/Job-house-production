'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface FilterControlsProps {
  language: string
  sort: string
  onLanguageChange: (language: string) => void
  onSortChange: (sort: string) => void
}

const LANGUAGES = ['Kinyarwanda', 'English', 'Swahili', 'French', 'Luganda']
const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'trending', label: 'Trending' },
  { value: 'popular', label: 'Most Popular' },
]

export default function FilterControls({ language, sort, onLanguageChange, onSortChange }: FilterControlsProps) {
  return (
    <div className="space-y-4">
      {/* Sort */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Sort By
        </label>
        <select 
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full p-2 border border-border rounded-md bg-background text-foreground"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Language */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Language
        </label>
        <select 
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="w-full p-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="">All Languages</option>
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
