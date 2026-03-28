'use client';

import { Loader2, Save, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { GeneratedLessonPlan } from '@/lib/ai/generate-lesson-plan';

interface LessonPlan {
  objectives: string[];
  materials: Array<{ name: string; url?: string; type?: string }>;
  structure: {
    introduction?: string;
    mainContent?: string;
    activities?: string;
    conclusion?: string;
  };
}

interface LessonPlanFormProps {
  lessonId: string;
  subject?: string;
  gradeYear?: string;
  topic?: string;
  duration?: number;
  classSize?: number;
}

export function LessonPlanForm({
  lessonId,
  subject,
  gradeYear,
  topic,
  duration,
  classSize,
}: LessonPlanFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [objectives, setObjectives] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [mainContent, setMainContent] = useState('');
  const [activities, setActivities] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [materials, setMaterials] = useState<Array<{ name: string; url: string }>>([]);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await fetch(`/api/lessons/${lessonId}/plan`);
        const json = await res.json();
        if (json.success && json.data) {
          const plan: LessonPlan = json.data;
          setObjectives(plan.objectives.join('\n'));
          setIntroduction(plan.structure.introduction || '');
          setMainContent(plan.structure.mainContent || '');
          setActivities(plan.structure.activities || '');
          setConclusion(plan.structure.conclusion || '');
          setMaterials(
            plan.materials.map((m) => ({ name: m.name, url: m.url || '' })),
          );
        }
      } catch {
        toast.error('Failed to load lesson plan');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlan();
  }, [lessonId]);

  function addMaterial() {
    setMaterials((prev) => [...prev, { name: '', url: '' }]);
  }

  function removeMaterial(index: number) {
    setMaterials((prev) => prev.filter((_, i) => i !== index));
  }

  function updateMaterial(index: number, field: 'name' | 'url', value: string) {
    setMaterials((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    );
  }

  async function handleAiGenerate() {
    if (!subject || !gradeYear || !topic) {
      toast.error('Lesson subject, grade, and topic are required for AI generation');
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/lesson-plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          gradeYear,
          topic,
          duration: duration ?? 45,
          classSize: classSize ?? 20,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        toast.error(json.message || 'AI generation failed');
        return;
      }
      const plan = json.data as GeneratedLessonPlan;
      setObjectives(plan.objectives.join('\n'));
      setIntroduction(plan.introduction?.content ?? '');
      setMainContent(plan.mainContent?.content ?? '');
      setActivities(plan.activities?.description ?? '');
      setConclusion(plan.conclusion?.summary ?? '');
      if (plan.materials?.length) {
        setMaterials(plan.materials.map((m) => ({ name: m, url: '' })));
      }
      toast.success('Lesson plan generated! Review and save.');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/plan`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objectives: objectives
            .split('\n')
            .map((o) => o.trim())
            .filter(Boolean),
          materials: materials
            .filter((m) => m.name.trim())
            .map((m) => ({ name: m.name, url: m.url || undefined })),
          structure: {
            introduction: introduction || undefined,
            mainContent: mainContent || undefined,
            activities: activities || undefined,
            conclusion: conclusion || undefined,
          },
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success('Lesson plan saved!');
      } else {
        toast.error(json.message || 'Failed to save');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p className="py-8 text-center text-muted-foreground">Loading lesson plan...</p>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Objectives (one per line)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={objectives}
            onChange={(e) => setObjectives(e.target.value)}
            placeholder="Students will be able to..."
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            rows={4}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Lesson Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Introduction</Label>
            <textarea
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="How will you introduce the topic?"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Main Content</Label>
            <textarea
              value={mainContent}
              onChange={(e) => setMainContent(e.target.value)}
              placeholder="Core content and teaching approach"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label>Activities</Label>
            <textarea
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              placeholder="Exercises and activities for students"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Conclusion</Label>
            <textarea
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              placeholder="Wrap-up and key takeaways"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
            Materials
            <Button variant="outline" size="sm" onClick={addMaterial}>
              + Add Material
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {materials.length === 0 ? (
            <p className="py-2 text-center text-sm text-muted-foreground">
              No materials added yet
            </p>
          ) : (
            <div className="space-y-2">
              {materials.map((m, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={m.name}
                    onChange={(e) => updateMaterial(i, 'name', e.target.value)}
                    placeholder="Material name"
                    className="flex-1"
                  />
                  <Input
                    value={m.url}
                    onChange={(e) => updateMaterial(i, 'url', e.target.value)}
                    placeholder="URL (optional)"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMaterial(i)}
                    className="text-destructive"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {subject && gradeYear && topic && (
        <Button
          variant="outline"
          onClick={handleAiGenerate}
          disabled={isGenerating || isSaving}
          className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-950"
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isGenerating ? 'Generating with AI...' : 'Generate with AI'}
        </Button>
      )}

      <Button onClick={handleSave} disabled={isSaving || isGenerating} className="w-full">
        {isSaving ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        Save Lesson Plan
      </Button>
    </div>
  );
}
