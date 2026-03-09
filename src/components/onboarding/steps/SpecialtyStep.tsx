import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Specialty {
  id: string;
  name: string;
  tags: string[];
}

interface SpecialtyStepProps {
  selectedSpecialty: string;
  setSelectedSpecialty: (v: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  setSelectedTags: (tags: string[]) => void;
  specialtySearch: string;
  setSpecialtySearch: (v: string) => void;
  specialties: Specialty[];
}

const SpecialtyStep = ({
  selectedSpecialty, setSelectedSpecialty, selectedTags, toggleTag, setSelectedTags,
  specialtySearch, setSpecialtySearch, specialties,
}: SpecialtyStepProps) => {
  const { t } = useTranslation();
  const filtered = specialties.filter(s => s.name.toLowerCase().includes(specialtySearch.toLowerCase()));
  const currentTags = specialties.find(s => s.id === selectedSpecialty)?.tags || [];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{t('onboarding.doctor.specialty')}</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10" placeholder={t('onboarding.doctor.search_specialty')} value={specialtySearch} onChange={e => setSpecialtySearch(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
          {filtered.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => { setSelectedSpecialty(s.id); setSelectedTags([]); setSpecialtySearch(''); }}
              className={`text-left px-3 py-2 rounded-lg border text-sm transition-all ${
                selectedSpecialty === s.id ? 'border-primary bg-primary/5 text-primary font-medium' : 'border-border hover:border-primary/30'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>
      {currentTags.length > 0 && (
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5" />
            {t('onboarding.doctor.select_tags')}
          </Label>
          <div className="flex flex-wrap gap-2">
            {currentTags.map(tag => (
              <Badge key={tag} variant={selectedTags.includes(tag) ? 'default' : 'outline'} className="cursor-pointer transition-colors" onClick={() => toggleTag(tag)}>
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialtyStep;
