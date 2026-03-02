// Mock subject-level data for site detail pages

export interface Subject {
  id: string
  siteId: string
  subjectNumber: string
  status: 'ACTIVE' | 'COMPLETED' | 'WITHDRAWN' | 'SCREEN_FAILURE'
  enrollmentDate: string
  age: number
  gender: 'M' | 'F'
  visitCompliance: number // %
  openQueries: number
  aeCount: number
  lastVisitDate: string
}

// Generate subjects for SITE-002-01 (Cleveland Cardiac) — the main demo site
export const subjectsSite002_01: Subject[] = [
  {
    id: 'S002-01-001',
    siteId: 'SITE-002-01',
    subjectNumber: '002-001',
    status: 'ACTIVE',
    enrollmentDate: '2024-10-12',
    age: 67,
    gender: 'M',
    visitCompliance: 71.4,
    openQueries: 4,
    aeCount: 2,
    lastVisitDate: '2026-01-28',
  },
  {
    id: 'S002-01-002',
    siteId: 'SITE-002-01',
    subjectNumber: '002-002',
    status: 'ACTIVE',
    enrollmentDate: '2024-10-25',
    age: 72,
    gender: 'F',
    visitCompliance: 85.7,
    openQueries: 3,
    aeCount: 1,
    lastVisitDate: '2026-02-03',
  },
  {
    id: 'S002-01-003',
    siteId: 'SITE-002-01',
    subjectNumber: '002-003',
    status: 'ACTIVE',
    enrollmentDate: '2024-11-08',
    age: 58,
    gender: 'M',
    visitCompliance: 64.3,
    openQueries: 5,
    aeCount: 0,
    lastVisitDate: '2026-01-15',
  },
  {
    id: 'S002-01-004',
    siteId: 'SITE-002-01',
    subjectNumber: '002-004',
    status: 'ACTIVE',
    enrollmentDate: '2024-11-20',
    age: 63,
    gender: 'F',
    visitCompliance: 50.0,
    openQueries: 6,
    aeCount: 3,
    lastVisitDate: '2026-01-10',
  },
  {
    id: 'S002-01-005',
    siteId: 'SITE-002-01',
    subjectNumber: '002-005',
    status: 'ACTIVE',
    enrollmentDate: '2024-12-03',
    age: 70,
    gender: 'M',
    visitCompliance: 75.0,
    openQueries: 2,
    aeCount: 1,
    lastVisitDate: '2026-02-07',
  },
  {
    id: 'S002-01-006',
    siteId: 'SITE-002-01',
    subjectNumber: '002-006',
    status: 'WITHDRAWN',
    enrollmentDate: '2024-12-15',
    age: 61,
    gender: 'M',
    visitCompliance: 33.3,
    openQueries: 2,
    aeCount: 0,
    lastVisitDate: '2025-09-20',
  },
  {
    id: 'S002-01-007',
    siteId: 'SITE-002-01',
    subjectNumber: '002-007',
    status: 'ACTIVE',
    enrollmentDate: '2025-01-09',
    age: 55,
    gender: 'F',
    visitCompliance: 88.9,
    openQueries: 0,
    aeCount: 2,
    lastVisitDate: '2026-02-10',
  },
]
