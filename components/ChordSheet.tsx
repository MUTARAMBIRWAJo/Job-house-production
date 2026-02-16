'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Music, 
  Clock, 
  User, 
  Download, 
  ChevronDown, 
  ChevronUp,
  Guitar,
  Piano,
  Volume2
} from 'lucide-react'
import { ChordSheet as ChordSheetType, DifficultyLevel, InstrumentType } from '@/lib/types'

interface ChordSheetProps {
  chordSheet: ChordSheetType
  showFull?: boolean
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
}

const instrumentIcons = {
  guitar: Guitar,
  piano: Piano,
  ukulele: Music,
  all: Music
}

export default function ChordSheet({ chordSheet, showFull = false }: ChordSheetProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<string>('chords')

  const toggleSection = (sectionName: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName)
    } else {
      newExpanded.add(sectionName)
    }
    setExpandedSections(newExpanded)
  }

  const renderChordLine = (line: any, lineIndex: number) => {
    const chords = line.chords || []
    const lyrics = line.lyrics || ''
    
    // Create an array of characters with chord information
    const elements: JSX.Element[] = []
    let lastChordPos = 0
    
    chords.forEach((chord: any, chordIndex: number) => {
      // Add lyrics before this chord
      if (chord.position > lastChordPos) {
        elements.push(
          <span key={`text-${lineIndex}-${chordIndex}`}>
            {lyrics.substring(lastChordPos, chord.position)}
          </span>
        )
      }
      
      // Add the chord above the lyrics
      elements.push(
        <div key={`chord-${lineIndex}-${chordIndex}`} className="inline-block relative">
          <span className="absolute -top-5 left-0 text-sm font-semibold text-blue-600 whitespace-nowrap">
            {chord.chord_name}
          </span>
          <span className="inline-block min-w-[1px]">
            {lyrics.substring(chord.position, chord.position + 1)}
          </span>
        </div>
      )
      
      lastChordPos = chord.position + 1
    })
    
    // Add remaining lyrics
    if (lastChordPos < lyrics.length) {
      elements.push(
        <span key={`text-end-${lineIndex}`}>
          {lyrics.substring(lastChordPos)}
        </span>
      )
    }
    
    return (
      <div key={lineIndex} className="leading-relaxed py-1">
        <div className="min-h-[20px] relative">
          {elements}
        </div>
      </div>
    )
  }

  const renderChordSection = (section: any, sectionIndex: number) => {
    const isExpanded = expandedSections.has(section.section_name) || showFull
    
    return (
      <Card key={sectionIndex} className="mb-4">
        <CardHeader 
          className="pb-3 cursor-pointer hover:bg-gray-50"
          onClick={() => !showFull && toggleSection(section.section_name)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{section.section_name}</CardTitle>
            {!showFull && (
              <Button variant="ghost" size="sm">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent className="pt-0">
            <div className="font-mono text-sm space-y-1">
              {section.chords?.map((line: any, lineIndex: number) => 
                renderChordLine(line, lineIndex)
              )}
            </div>
          </CardContent>
        )}
      </Card>
    )
  }

  const InstrumentIcon = instrumentIcons[chordSheet.instrument_type]

  return (
    <div className="space-y-4">
      {/* Header Information */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5" />
                {chordSheet.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1">
                  <InstrumentIcon className="w-4 h-4" />
                  {chordSheet.instrument_type}
                </span>
                <span>Key: {chordSheet.key_signature}</span>
                {chordSheet.tempo && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {chordSheet.tempo} BPM
                  </span>
                )}
                <span>{chordSheet.time_signature}</span>
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Badge className={difficultyColors[chordSheet.difficulty_level]}>
                {chordSheet.difficulty_level}
              </Badge>
              {chordSheet.is_official && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Official
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chords">Chord Sheet</TabsTrigger>
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chords" className="space-y-4">
          {chordSheet.chord_progression?.map((section: any, index: number) => 
            renderChordSection(section, index)
          )}
        </TabsContent>
        
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chord Sheet Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Key Signature</label>
                  <p className="text-lg font-semibold">{chordSheet.key_signature}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Time Signature</label>
                  <p className="text-lg font-semibold">{chordSheet.time_signature}</p>
                </div>
                {chordSheet.tempo && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tempo</label>
                    <p className="text-lg font-semibold">{chordSheet.tempo} BPM</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Difficulty</label>
                  <p className="text-lg font-semibold capitalize">{chordSheet.difficulty_level}</p>
                </div>
              </div>
              
              {chordSheet.creator && (
                <div className="pt-4 border-t">
                  <label className="text-sm font-medium text-gray-600">Created by</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4" />
                    <span>{chordSheet.creator.full_name || 'Anonymous'}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Practice Tools</CardTitle>
              <CardDescription>Tools to help you practice this song</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Play Metronome
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Change Tempo
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  Transpose Key
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
