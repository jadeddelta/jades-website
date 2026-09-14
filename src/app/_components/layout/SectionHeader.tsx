import { SECTION_KICKER } from '../../_sections/sections';
import type { SectionId } from '../../_sections/sections';

interface SectionHeaderProps {
  section: SectionId
  title: string
}

export default function SectionHeader({ section, title }: SectionHeaderProps) {
  const kicker = SECTION_KICKER[section];

  return (
    <div className="flex w-full items-center gap-6">
      {kicker && (
        <span className="font-mono text-[13px] tracking-[0.16em] text-mono-dim">{kicker}</span>
      )}
      <h2>{title}</h2>
      <span className="h-px flex-1" style={{ background: 'var(--hairline)' }} />
    </div>
  );
}
