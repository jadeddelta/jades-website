/**
 * list of mounted page sections, in document order: keying off section ids and 
 * used for typing the kickers/labels
 * 
 * TODO: determine if we want to use a final contact section, or any others
 * TODO: for side navigation, etc...
 */
export const SECTION_IDS = ['main', 'about', 'projects', 'work'] as const

export type SectionId = (typeof SECTION_IDS)[number]

/** The mono kicker shown beside each section title. The hero has none. */
export const SECTION_KICKER: Record<SectionId, string | null> = {
  main: null,
  about: '// 01',
  projects: '// 02',
  work: '// 03',
}

/** Nav label per section. The hero is labelled `home`. */
export const SECTION_LABEL: Record<SectionId, string> = {
  main: 'home',
  about: 'about',
  projects: 'projects',
  work: 'work',
}
